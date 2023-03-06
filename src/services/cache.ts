import localforage from "localforage";
import { DB_NAME, supabase } from "./db";
import { Part, Score } from "./scores";
import { useLibraries } from "./libraries";
import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { useUserId } from "./auth";
import { Store } from "pullstate";
import { getStoreName, StoreKeys } from "./cleanup";
import { uiStore } from "./ui";
import { getPdf, renderPage } from "./pdf";
import { usePlaylists } from "./playlists";

export enum Cache {
  Success = 1,
  Failed,
  Working,
}

export const cache = localforage.createInstance({
  name: DB_NAME,
  storeName: getStoreName(StoreKeys.ScoreCache),
});

type StoreShape = { [key: string]: Cache };
export const cacheStore = new Store<StoreShape>({});

const setCacheState = (key: string, state: Cache) => {
  cacheStore.update((s) => {
    return { ...s, [key]: state };
  });
};

const cachePart = async (part: Part) => {
  const { data: blob, error } = await supabase.storage
    .from("parts")
    .download(part.url);
  if (error) {
    throw new Error("not-found");
  } else {
    const pdf = await getPdf(blob);
    const thumb = await renderPage(pdf, 1);
    await pdf.destroy();

    cache.setItem("/" + part.url, { pdf: blob, thumb });
  }
};

const cacheScore = async (score: Score, keys: string[]) => {
  try {
    setCacheState(score.key, Cache.Working);
    await Promise.all(
      score.parts.map(async (part) => {
        if (!keys.includes("/" + part.url)) {
          return cachePart(part);
        }
      })
    );
    setCacheState(score.key, Cache.Success);
  } catch (e) {
    console.log(e);
    setCacheState(score.key, Cache.Failed);
  }
};

const getLibraryScores = async (key: string) => {
  const [resource, uid, query] = key.split("/");

  const { data } = await supabase
    .from("library_scores")
    .select("score(key,title,artist,parts)")
    .or(query)
    .returns<any>();

  const scores = data.map((item) => item.score);

  return scores;
};

const getPlaylistScores = async (key: string) => {
  const [resource, uid, query] = key.split("/");

  const { data } = await supabase
    .from("playlist_scores")
    .select("score(key,title,artist,parts)")
    .or(query)
    .returns<any>();

  const scores = data.map((item) => item.score);

  return scores;
};

export const useAllScores = () => {
  const uid = useUserId();

  const { libraries } = useLibraries();
  const { playlists } = usePlaylists();

  const librariesQuery = libraries
    .map((library) => `library.eq.${library.key}`)
    .join(",");

  const librariesKey =
    uid && librariesQuery
      ? `all-library-scores/${uid}/${librariesQuery}`
      : null;
  const { data: libraryScores, mutate: mutateLibraries } = useSWR<Score[]>(
    librariesKey,
    getLibraryScores
  );

  const playlistsQuery = playlists
    .map((playlist) => `playlist.eq.${playlist.key}`)
    .join(",");

  const playlistsKey =
    uid && playlistsQuery
      ? `all-playlist-scores/${uid}/${playlistsQuery}`
      : null;
  const { data: playlistScores, mutate: mutatePlaylists } = useSWR<Score[]>(
    playlistsKey,
    getPlaylistScores
  );

  const scores = useMemo(
    () => [...(libraryScores || []), ...(playlistScores || [])],
    [libraryScores, playlistScores]
  );

  return {
    scores,
    mutate: async () => {
      return Promise.all([mutateLibraries(), mutatePlaylists()]);
    },
  };
};

export const useCache = () => cacheStore.useState((s) => s);
export const useCachedState = (scoreKey: string) => {
  const cache = useCache();

  return cache[scoreKey] || Cache.Working;
};

export const useCacheWorker = () => {
  const online = uiStore.useState((s) => s.online);
  const { scores } = useAllScores();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const keys = await cache.keys();
      for (let i = 0; i < scores.length; i++) {
        if (cancelled) {
          break;
        }

        const score = scores[i];
        await cacheScore(score, keys);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scores, online]);
};
