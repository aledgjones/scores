import localforage from "localforage";
import { DB_NAME, supabase } from "./db";
import { Part, Score } from "./scores";
import { useLibraries } from "./libraries";
import useSWR from "swr";
import { useEffect } from "react";
import { useUserId } from "./auth";
import { Store } from "pullstate";
import { getStoreName, StoreKeys } from "./cleanup";
import { uiStore } from "./ui";
import { getPdf, renderPage } from "./pdf";

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

export const useAllScores = () => {
  const uid = useUserId();

  const { libraries } = useLibraries();

  const query = libraries
    .map((library) => `library.eq.${library.key}`)
    .join(",");

  const key = uid && query ? `all-scores/${uid}/${query}` : null;
  const { data, mutate } = useSWR<Score[]>(key, getLibraryScores);

  return { scores: data || [], mutate };
};

export const useCache = () => cacheStore.useState((s) => s);

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
