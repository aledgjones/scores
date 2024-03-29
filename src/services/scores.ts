import useSWR from "swr";
import { FileEntry, FileState } from "../components/files-list/files-list";
import { supabase } from "./db";
import { v4 as uuid } from "uuid";
import { cache } from "./cache";

export enum Genre {
  Classical = "classical",
  RockAndPop = "rockandpop",
  JazzAndSwing = "jazzandswing",
  SoulAndFunk = "soulandfunk",
  FilmAndTheatre = "filmandtheatre",
  Traditional = "traditional",
  Festive = "festive",
  Worship = "worship",
  Other = "other",
}

export interface Part {
  key: string;
  name: string;
  size: number;
  url: string;
}

export interface Score {
  key: string;
  title: string;
  artist: string;
  genre: Genre;
  parts: Part[];
}

export interface PlaylistScore extends Score {
  playlistKey: string;
  tag: string | null;
}

const getLibraryScores = async (key: string) => {
  const [resource, libraryKey] = key.split("/");
  const { data } = await supabase
    .from("library_scores")
    .select("score(key, title, artist, genre, parts)")
    .eq("library", libraryKey)
    .returns<any>();

  const scores = data
    .map((item) => item.score)
    .sort((a, b) => {
      return a.title.toUpperCase().localeCompare(b.title.toUpperCase());
    });

  return scores;
};

export const useLibraryScores = (libraryKey: string) => {
  const key = `library-scores/${libraryKey}`;

  const { data, mutate } = useSWR<Score[]>(() => {
    return libraryKey ? key : null;
  }, getLibraryScores);

  return { scores: data || [], mutate };
};

const getPlaylistScores = async (key: string) => {
  const [resource, playlistKey] = key.split("/");

  const { data } = await supabase
    .from("playlist_scores")
    .select("key,score(key, title, artist, genre, parts),order,tag")
    .order("order", { ascending: true })
    .eq("playlist", playlistKey)
    .returns<any>();

  const scores = data.map((item) => {
    return { ...item.score, playlistKey: item.key, tag: item.tag };
  });

  return scores;
};

export const usePlaylistScores = (playlistKey: string) => {
  const key = `playlist-scores/${playlistKey}`;

  const { data, mutate } = useSWR<PlaylistScore[]>(() => {
    return playlistKey ? key : null;
  }, getPlaylistScores);

  return { scores: data || [], mutate };
};

export const createScore = async (
  libraryKey: string,
  title: string,
  artist: string,
  genre: Genre,
  files: FileEntry[],
  onChange: (partKey: string, state: FileState) => void,
  scoreKey = uuid()
) => {
  if (!libraryKey) {
    throw new Error("Something went wrong");
  }

  if (!title) {
    throw new Error("Please provide a title for your score");
  }

  if (!artist) {
    throw new Error("Please provide an artist for your score");
  }

  if (!genre) {
    throw new Error("Please provide a genre for your score");
  }

  if (files.length === 0) {
    throw new Error("Please provide at least one part");
  }

  if (files.filter((file) => !file.name).length > 0) {
    throw new Error("Please provide a name for each part");
  }

  const parts = await Promise.all(
    files.map(async ({ key: partKey, name, file }) => {
      onChange(partKey, FileState.Uploading);

      const path = `${scoreKey}/${partKey}.pdf`;
      const { error } = await supabase.storage
        .from("parts")
        .upload(path, file!, {
          cacheControl: `${3600 * 24 * 365}`, // cache for 1 year
          upsert: true,
        });

      if (error) {
        onChange(partKey, FileState.Error);
        throw new Error(
          "Something went wrong while uploading your scores, please try again."
        );
      } else {
        onChange(partKey, FileState.Complete);
        return {
          key: partKey,
          url: path,
          size: file?.size || 0,
          name,
        };
      }
    })
  );

  await supabase.from("scores").insert([
    {
      key: scoreKey,
      title,
      artist,
      genre,
      parts,
    },
  ]);
  await supabase.from("library_scores").insert([
    {
      library: libraryKey,
      score: scoreKey,
    },
  ]);
};

export const editScore = async (
  libraryKey: string,
  scoreKey: string,
  title: string,
  artist: string,
  genre: Genre,
  files: FileEntry[],
  discarded: FileEntry[],
  onChange: (partKey: string, state: FileState) => void
) => {
  if (!libraryKey) {
    throw new Error("Something went wrong");
  }

  if (!title) {
    throw new Error("Please provide a title for your score");
  }

  if (!artist) {
    throw new Error("Please provide an artist for your score");
  }

  if (!genre) {
    throw new Error("Please provide a genre for your score");
  }

  if (files.length === 0) {
    throw new Error("Please provide at least one part");
  }

  if (files.filter((file) => !file.name).length > 0) {
    throw new Error("Please provide a name for each part");
  }

  const paths = discarded.map((part) => part.url || "");
  await supabase.storage.from("parts").remove(paths);

  const parts = await Promise.all(
    files.map(async ({ key: partKey, name, file, url, size }) => {
      if (file) {
        onChange(partKey, FileState.Uploading);

        const path = `${scoreKey}/${partKey}.pdf`;
        const { error } = await supabase.storage
          .from("parts")
          .upload(path, file, {
            cacheControl: `${3600 * 24 * 365}`, // cache for 1 year
            upsert: true,
          });

        if (error) {
          onChange(partKey, FileState.Error);
          throw new Error(
            "Something went wrong while uploading your scores, please try again."
          );
        } else {
          onChange(partKey, FileState.Complete);
          return {
            key: partKey,
            url: path,
            size,
            name,
          };
        }
      } else {
        onChange(partKey, FileState.Complete);
        return {
          key: partKey,
          url,
          size,
          name,
        };
      }
    })
  );

  await supabase
    .from("scores")
    .update([
      {
        key: scoreKey,
        title,
        artist,
        genre,
        parts,
      },
    ])
    .eq("key", scoreKey);
};

export const deleteScore = async (score: Score) => {
  await supabase.from("library_scores").delete().eq("score", score.key);
  await supabase.from("playlist_scores").delete().eq("score", score.key);
  await supabase.from("scores").delete().eq("key", score.key);
  const paths = score.parts.map((part) => part.url);
  await supabase.storage.from("parts").remove(paths);
  await Promise.all(
    paths.map((path) => {
      return cache.removeItem("/" + path);
    })
  );
};
