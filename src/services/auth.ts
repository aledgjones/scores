import { useEffect } from "react";
import { create } from "zustand";
import { supabase } from "./db";
import { createLibrary } from "./libraries";
import { useAsync } from "react-use";

export type UserId = string | null;
export type Email = string | null;
export type AuthShape = { uid: UserId; email: Email };

export type StoreShape = {
  auth: AuthShape | null | undefined;
  setAuthSession: () => Promise<void>;
};

export const useAuth = create<StoreShape>()((set) => {
  return {
    auth: undefined,
    setAuthSession: async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user?.id) {
        set({
          auth: { uid: data.session.user.id, email: data.session.user.email },
        });
      } else {
        set({ auth: null });
      }
    },
  };
});

export const useUserId = (): string | null => {
  const { auth } = useAuth();

  return auth?.uid || null;
};

export const getUserId = (): string | null => {
  return useAuth.getState().auth?.uid || null;
};

export const getUserEmail = (): string | null => {
  return useAuth.getState().auth?.email || null;
};

export const useAuthListener = () => {
  const { setAuthSession } = useAuth();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => setAuthSession());

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setAuthSession]);
};

export const useResumeSession = () => {
  const { setAuthSession, auth } = useAuth();

  useAsync(setAuthSession, []);

  return auth;
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Please provide an email and password");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

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

  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({ email, password });

  if (!session || error) {
    return new Error(error?.message);
  }

  const uid = session.user.id;

  // create user entry
  await supabase
    .from("users")
    .insert([{ uid, email, name, searchable: false }]);

  return createLibrary(uid, `${name}'s Library`);
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
