import localforage from "localforage";
import useSWR from "swr";
import { getUserEmail, getUserUid, useUid } from "./auth";
import { DB_NAME, supabase } from "./db";
import { deleteScore, Score } from "./scores";

const lastLibraryStorage = localforage.createInstance({
  name: DB_NAME,
  storeName: "last-library-v1",
});

const getLibraries = async (key: string, uid: string) => {
  const { data } = await supabase
    .from("library_members")
    .select("library(key,name,owner(uid,name,email)),read,write")
    .eq("user", uid);

  const libraries = data
    .map((item) => {
      return {
        read: item.read,
        write: item.write,
        ...item.library,
      };
    })
    .sort((a, b) => {
      return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });

  return libraries;
};

const getLibraryMembers = async (key: string, libraryKey: string) => {
  const { data } = await supabase
    .from("library_members")
    .select("user(uid, name, email),read,write")
    .eq("library", libraryKey);

  const members = data
    .map((item) => {
      return {
        read: item.read,
        write: item.write,
        ...item.user,
      };
    })
    .sort((a, b) => {
      return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });

  return members;
};

export interface Library {
  key: string;
  name: string;
  owner: {
    email: string;
    name: string;
    uid: string;
  };
  read: boolean;
  write: boolean;
}

export interface LibraryMember {
  uid: string;
  name: string;
  email: string;
  read: boolean;
  write: boolean;
}

export const useLibraries = () => {
  const uid = useUid();
  const key = `libraries/${uid}`;

  const { data, mutate } = useSWR<Library[]>(() => {
    return uid ? [key, uid] : null;
  }, getLibraries);

  return { libraries: data || [], mutate };
};

export const useLibrary = (libraryKey: string) => {
  const { libraries } = useLibraries();
  return libraries.find((library) => library.key === libraryKey) ?? null;
};

export const useLibraryMembers = (libraryKey: string) => {
  const key = `/library-members/${libraryKey}`;
  const { data, mutate } = useSWR<LibraryMember[]>(() => {
    return libraryKey ? [key, libraryKey] : null;
  }, getLibraryMembers);

  return { members: data || [], mutate };
};

export const useLibraryMember = (libraryKey: string, uid: string) => {
  const { members, mutate } = useLibraryMembers(libraryKey);
  const user = members.find((member) => member.uid === uid) ?? null;

  return { user, mutate };
};

export const setLastLibrary = (key: string) => {
  const uid = getUserUid();
  if (uid) {
    lastLibraryStorage.setItem(uid, key);
  }
};

export const getLastLibrary = async (libraries: Library[]) => {
  const uid = getUserUid();

  if (uid) {
    const key = await lastLibraryStorage.getItem<string>(uid);
    if (key && libraries.find((library) => library.key === key)) {
      return key;
    }
  }

  return libraries[0].key;
};

export const addMemberToLibrary = (
  uid: string,
  libraryKey: string,
  read: boolean,
  write: boolean
) => {
  return supabase
    .from("library_members")
    .insert([{ user: uid, library: libraryKey, read, write }]);
};

export const createLibrary = async (name: string) => {
  const uid = getUserUid();

  if (!uid) {
    throw new Error("Something went wrong");
  }
  if (!name) {
    throw new Error("Please provide a name for your library");
  }

  const { data } = await supabase
    .from("libraries")
    .insert([{ name, owner: uid }]);

  const libraryKey = data[0].key;
  await addMemberToLibrary(uid, libraryKey, true, true);

  return libraryKey;
};

export const updateLibrary = async (libraryKey: string, name: string) => {
  const uid = getUserUid();

  if (!uid || !libraryKey) {
    throw new Error("Something went wrong");
  }
  if (!name) {
    throw new Error("Please provide a name for your library");
  }

  const { error } = await supabase
    .from("libraries")
    .update([{ name }])
    .eq("key", libraryKey);

  if (error) {
    throw error;
  }

  return libraryKey;
};

const getLibraryInviteEntry = async (libraryKey: string, email: string) => {
  return supabase
    .from("library_invites")
    .select("key")
    .match({ library: libraryKey, email })
    .maybeSingle();
};

export const sendInviteToLibrary = async (
  libraryKey: string,
  email: string
) => {
  const { data } = await getLibraryInviteEntry(libraryKey, email);
  const members: LibraryMember[] = await getLibraryMembers(null, libraryKey);
  const hasInvite = data !== null;
  const isMember = !!members.find((user) => user.email === email);

  if (hasInvite) {
    throw new Error("Invite is already sent, please wait for a response");
  }

  if (isMember) {
    throw new Error("This user is already a member of this library");
  }

  const { error } = await supabase
    .from("library_invites")
    .insert({ library: libraryKey, email });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const revokeLibraryInvite = async (
  libraryKey: string,
  email: string
) => {
  const { error } = await supabase
    .from("library_invites")
    .delete()
    .match({ library: libraryKey, email });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const revokeLibraryAccess = async (libraryKey: string, uid: string) => {
  const { error } = await supabase
    .from("library_members")
    .delete()
    .match({ library: libraryKey, user: uid });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

const getLibraryInvites = async (url: string, libraryKey: string) => {
  const { data } = await supabase
    .from("library_invites")
    .select("email")
    .match({ library: libraryKey });

  return data.map((item) => item.email);
};

export const useLibraryInvites = (libraryKey: string) => {
  const key = `/library-invites/${libraryKey}`;
  const { data, mutate } = useSWR<string[]>(() => {
    return libraryKey ? [key, libraryKey] : null;
  }, getLibraryInvites);
  return { invites: data || [], mutate };
};

const getUserLibraryInvites = async (url: string, email: string) => {
  const { data } = await supabase
    .from("library_invites")
    .select("key,library(key,name,owner(name))")
    .match({ email });
  return data.map((item) => {
    return {
      key: item.key,
      libraryKey: item.library.key,
      name: item.library.name,
      owner: item.library.owner.name,
    };
  });
};

interface Invite {
  key: string;
  libraryKey: string;
  name: string;
  owner: string;
}

export const useUserLibraryInvites = () => {
  const email = getUserEmail();
  const key = `/user-library-invites/${email}`;
  const { data, mutate } = useSWR<Invite[]>(() => {
    return email ? [key, email] : null;
  }, getUserLibraryInvites);

  const invites = data || [];

  return { invites, mutate };
};

export const acceptLibraryInvite = async (libraryKey: string) => {
  const uid = getUserUid();
  const email = getUserEmail();

  // check for the invite they are trying to accept
  const { data } = await getLibraryInviteEntry(libraryKey, email);

  if (!data) {
    throw new Error("The invite was not found for this library");
  }

  // add library memnber
  await supabase.from("library_members").insert({
    user: uid,
    library: libraryKey,
    read: true,
    write: false,
  });

  // delete invite
  return supabase
    .from("library_invites")
    .delete()
    .match({ library: libraryKey, email });
};

export const rejectLibraryInvite = async (libraryKey: string) => {
  const email = getUserEmail();

  // delete invite
  return supabase
    .from("library_invites")
    .delete()
    .match({ library: libraryKey, email });
};

export const updateLibraryUserPermissions = (
  libraryKey: string,
  user: LibraryMember | undefined,
  read: boolean,
  write: boolean
) => {
  if (!user) {
    throw new Error("Something went wrong. Please try again.");
  }

  return supabase
    .from("library_members")
    .update({ read, write })
    .match({ user: user.uid, library: libraryKey });
};

export const deleteLibrary = async (libraryKey: string, scores: Score[]) => {
  const uid = getUserUid();

  if (!uid || !libraryKey || !scores) {
    throw new Error("Something went wrong");
  }

  console.log(libraryKey, scores);

  await Promise.all(
    scores.map((score) => {
      return deleteScore(score);
    })
  );

  {
    const { error } = await supabase
      .from("library_members")
      .delete()
      .eq("library", libraryKey);

    if (error) {
      throw error;
    }
  }

  {
    const { error } = await supabase
      .from("library_invites")
      .delete()
      .eq("library", libraryKey);

    if (error) {
      throw error;
    }
  }

  {
    const { error } = await supabase
      .from("libraries")
      .delete()
      .eq("key", libraryKey);

    if (error) {
      throw error;
    }
  }

  await lastLibraryStorage.removeItem(uid);

  return libraryKey;
};
