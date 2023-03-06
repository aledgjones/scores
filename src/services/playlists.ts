import useSWR from "swr";
import { useUserId, getUserId, getUserEmail } from "./auth";
import { supabase } from "./db";
import { PlaylistScore } from "./scores";

export interface PlaylistMember {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  read: boolean;
  write: boolean;
}

const getPlaylists = async (key) => {
  const [resource, uid] = key.split("/");

  const { data } = await supabase
    .from("playlist_members")
    .select("playlist(key,name,owner(uid,name,email)),read,write")
    .eq("user", uid)
    .returns<any>();

  const playlists = data
    .map((item) => {
      return {
        read: item.read,
        write: item.write,
        ...item.playlist,
      };
    })
    .sort((a, b) => {
      return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });

  return playlists;
};

export interface Playlist {
  key: string;
  name: string;
  owner: {
    name: string;
    email: string;
    uid: string;
  };
  read: boolean;
  write: boolean;
}

export const usePlaylists = () => {
  const uid = useUserId();

  const key = uid ? `playlists/${uid}` : null;
  const { data, mutate } = useSWR<Playlist[]>(key, getPlaylists);

  return { playlists: data || [], mutate };
};

export const usePlaylist = (key: string) => {
  const { playlists } = usePlaylists();
  return playlists.find((playlist) => playlist.key === key) ?? null;
};

export const createPlaylist = async (name: string) => {
  const uid = getUserId();

  if (!uid) {
    throw new Error("Something went wrong");
  }
  if (!name) {
    throw new Error("Please provide a name for your playlist");
  }

  const { data } = await supabase
    .from("playlists")
    .insert([{ name, owner: uid }])
    .select();

  const key = data[0].key;

  await supabase
    .from("playlist_members")
    .insert([{ user: uid, playlist: key, read: true, write: true }]);

  return key;
};

export const updatePlaylist = async (playlistKey: string, name: string) => {
  const uid = getUserId();

  if (!uid || !playlistKey) {
    throw new Error("Something went wrong");
  }
  if (!name) {
    throw new Error("Please provide a name for your playlist");
  }

  const { error } = await supabase
    .from("playlists")
    .update([{ name }])
    .eq("key", playlistKey);

  if (error) {
    throw error;
  }

  return playlistKey;
};

export const deletePlaylist = async (playlistKey: string) => {
  const uid = getUserId();

  if (!uid || !playlistKey) {
    throw new Error("Something went wrong");
  }

  {
    const { error } = await supabase
      .from("playlist_members")
      .delete()
      .eq("playlist", playlistKey);

    if (error) {
      throw error;
    }
  }

  {
    const { error } = await supabase
      .from("playlist_scores")
      .delete()
      .eq("playlist", playlistKey);

    if (error) {
      throw error;
    }
  }

  {
    const { error } = await supabase
      .from("playlists")
      .delete()
      .eq("key", playlistKey);

    if (error) {
      throw error;
    }
  }

  return playlistKey;
};

export const addToPlaylist = async (playlistKey: string, scoreKey: string) => {
  const { data: orderData, error: orderError } = await supabase
    .from("playlist_scores")
    .select("order")
    .eq("playlist", playlistKey)
    .order("order", { ascending: false })
    .limit(1);

  if (orderError) {
    throw new Error("Something went wrong");
  }

  if (orderData) {
    const order: number = orderData?.[0]?.order || 0;

    const { error } = await supabase
      .from("playlist_scores")
      .insert([{ score: scoreKey, playlist: playlistKey, order: order + 1 }]);

    if (error) {
      throw new Error("Something went wrong");
    }
  }
};

export const reorderPlaylist = async (
  playlistKey: string,
  scores: PlaylistScore[]
) => {
  const { error } = await supabase.from("playlist_scores").upsert(
    scores.map((score, i) => {
      return {
        key: score.playlistKey,
        score: score.key,
        playlist: playlistKey,
        order: i,
        tag: score.tag,
      };
    })
  );
  if (error) {
    throw new Error(error.message);
  }
};

export const removeFromPlaylist = async (scoreKey: string) => {
  const { error } = await supabase
    .from("playlist_scores")
    .delete()
    .eq("key", scoreKey);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateTag = async (scoreKey: string, tag: string) => {
  const { error } = await supabase
    .from("playlist_scores")
    .update({ tag })
    .eq("key", scoreKey);
  if (error) {
    throw new Error(error.message);
  }
};

const getPlaylistMembers = async (key: string) => {
  const [resource, playlistKey] = key.split("/");

  const { data } = await supabase
    .from("playlist_members")
    .select("user(uid, name, email, avatar),read,write")
    .eq("playlist", playlistKey)
    .returns<any>();

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

export const usePlaylistMember = (playlistKey: string, uid: string) => {
  const { members, mutate } = usePlaylistMembers(playlistKey);
  const user = members.find((member) => member.uid === uid) ?? null;

  return { user, mutate };
};

export const usePlaylistMembers = (playlistKey: string) => {
  const key = playlistKey ? `playlist-members/${playlistKey}` : null;
  const { data, mutate } = useSWR<PlaylistMember[]>(key, getPlaylistMembers);

  return { members: data || [], mutate };
};

const getPlaylistInvites = async (key: string) => {
  const [resource, playlistKey] = key.split("/");
  const { data } = await supabase
    .from("playlist_invites")
    .select("email")
    .match({ playlist: playlistKey });

  return data.map((item) => item.email);
};

export const usePlaylistInvites = (playlistKey: string) => {
  const key = playlistKey ? `playlist-invites/${playlistKey}` : null;
  const { data, mutate } = useSWR<string[]>(key, getPlaylistInvites);

  return { invites: data || [], mutate };
};

const getHasPlaylistInvite = async (playlistKey: string, email: string) => {
  const { data } = await supabase
    .from("playlist_invites")
    .select("key")
    .match({ playlist: playlistKey, email });

  return data.length > 0;
};

export const sendInviteToPlaylist = async (
  playlistKey: string,
  email: string
) => {
  const hasPlaylistInvite = await getHasPlaylistInvite(playlistKey, email);
  const members: PlaylistMember[] = await getPlaylistMembers(
    `playlist-members/${playlistKey}`
  );

  const isMember = !!members.find((user) => user.email === email);

  if (hasPlaylistInvite) {
    throw new Error("Invite is already sent, please wait for a response");
  }

  if (isMember) {
    throw new Error("This user is already a member of this playlist");
  }

  const { error } = await supabase
    .from("playlist_invites")
    .insert({ playlist: playlistKey, email });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const revokePlaylistInvite = async (
  playlistKey: string,
  email: string
) => {
  const { error } = await supabase
    .from("playlist_invites")
    .delete()
    .match({ playlist: playlistKey, email });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const revokePlaylistAccess = async (
  playlistKey: string,
  uid: string
) => {
  const { error } = await supabase
    .from("playlist_members")
    .delete()
    .match({ playlist: playlistKey, user: uid });
  if (error) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const updatePlaylistUserPermissions = (
  playlistKey: string,
  user: PlaylistMember | undefined,
  read: boolean,
  write: boolean
) => {
  if (!user) {
    throw new Error("Something went wrong. Please try again.");
  }

  return supabase
    .from("playlist_members")
    .update({ read, write })
    .match({ user: user.uid, playlist: playlistKey });
};

const getUserPlaylistInvites = async (key: string) => {
  const [resource, email] = key.split("/");

  const { data } = await supabase
    .from("playlist_invites")
    .select("key,playlist(key,name,owner(name))")
    .match({ email })
    .returns<any>();

  return data.map((item) => {
    return {
      key: item.key,
      playlistKey: item.playlist.key,
      name: item.playlist.name,
      owner: item.playlist.owner.name,
    };
  });
};

interface Invite {
  key: string;
  playlistKey: string;
  name: string;
  owner: string;
}

export const useUserPlaylistInvites = () => {
  const email = getUserEmail();
  const key = `user-playlist-invites/${email}`;
  const { data, mutate } = useSWR<Invite[]>(() => {
    return email ? key : null;
  }, getUserPlaylistInvites);

  const invites = data || [];

  return { invites, mutate };
};

export const acceptPlaylistInvite = async (playlistKey: string) => {
  const uid = getUserId();
  const email = getUserEmail();

  // check for the invite they are trying to accept
  const hasInvite = await getHasPlaylistInvite(playlistKey, email);

  if (!hasInvite) {
    throw new Error("The invite was not found for this playlist");
  }

  // add playlist memnber
  await supabase.from("playlist_members").insert({
    user: uid,
    playlist: playlistKey,
    read: true,
    write: false,
  });

  // delete invite
  return supabase
    .from("playlist_invites")
    .delete()
    .match({ playlist: playlistKey, email });
};

export const rejectPlaylistInvite = async (playlistKey: string) => {
  const email = getUserEmail();

  // delete invite
  return supabase
    .from("playlist_invites")
    .delete()
    .match({ playlist: playlistKey, email });
};
