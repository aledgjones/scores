import { Store } from "pullstate";
import { useEffect } from "react";
import { supabase } from "./db";

export type Uid = string | null;

export const getUserUid = (): Uid => {
  return supabase.auth.user()?.id || null;
};

const auth = new Store<{ id: Uid }>({ id: supabase.auth.user()?.id || null });

export const useUidListener = () => {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session?.user?.id || null);
      auth.update(() => {
        return { id: session?.user?.id || null };
      });
    });
  }, []);
};

export const useUid = () => {
  return auth.useState((s) => s.id);
};

export const getUserEmail = () => {
  return supabase.auth.user()?.email;
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Please provide an email and password");
  }

  const { error } = await supabase.auth.signIn({ email, password });

  if (error) {
    throw new Error(error.message);
  }
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  terms: boolean
) => {
  if (!name || !email || !password) {
    throw new Error("Please provide your name, email and password");
  }

  if (!terms) {
    throw new Error("Please accept the terms and conditions");
  }

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (!user || error) {
    return new Error(error?.message);
  }

  // create user entry
  await supabase
    .from("users")
    .insert([{ uid: user.id, email, name, searchable: false }]);

  // create library
  const { data } = await supabase
    .from("libraries")
    .insert([{ name: "My Library", owner: user.id }]);

  // add user as member of library
  await supabase
    .from("library_members")
    .insert([{ user: user.id, library: data[0].key, read: true, write: true }]);
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
