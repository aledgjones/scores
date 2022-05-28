import useSWR from "swr";
import { getUserUid } from "./auth";
import { supabase } from "./db";
import { PlaylistScore } from "./scores";

const getPlaylists = async (key: string, uid: string) => {
  const { data } = await supabase
    .from("playlist_members")
    .select("playlist(key,name,owner(uid,name,email)),read,write")
    .eq("user", uid);

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
  const uid = getUserUid();
  const key = `playlists/${uid}`;

  const { data, mutate } = useSWR<Playlist[]>(() => {
    return uid ? [key, uid] : null;
  }, getPlaylists);

  return { playlists: data || [], mutate };
};

export const usePlaylist = (key: string) => {
  const { playlists } = usePlaylists();
  return playlists.find((playlist) => playlist.key === key) ?? null;
};

export const createPlaylist = async (name: string) => {
  const uid = getUserUid();

  if (!uid) {
    throw new Error("Something went wrong");
  }
  if (!name) {
    throw new Error("Please provide a name for your playlist");
  }

  const { data } = await supabase
    .from("playlists")
    .insert([{ name, owner: uid }]);

  const key = data[0].key;

  await supabase
    .from("playlist_members")
    .insert([{ user: uid, playlist: key, read: true, write: true }]);

  return key;
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
