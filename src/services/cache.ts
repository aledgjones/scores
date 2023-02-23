import localforage from "localforage";
import { DB_NAME, supabase } from "./db";
import { Part, Score } from "./scores";
import { useLibraries } from "./libraries";
import useSWR from "swr";
import { useEffect } from "react";
import { Store } from "pullstate";
import { useUid } from "./auth";
import { getPdf, renderPage } from "./pdf";
import toast from "react-hot-toast";

export enum Cache {
  Success = 1,
  Failed,
  Working,
}

export const cached = new Store<{ [key: string]: Cache }>({});
export const cache = localforage.createInstance({
  name: DB_NAME,
  storeName: "score-cache-v1",
});

const cachePart = async (part: Part) => {
  const { data: blob, error } = await supabase.storage
    .from("parts")
    .download(part.url);
  if (error) {
    throw new Error("not-found");
  } else {
    const pages = [];
    const doc = await getPdf(blob);
    for (let i = 0; i < doc.numPages; i++) {
      const img = await renderPage(doc, i + 1);
      pages.push(img);
    }
    doc.destroy();
    cache.setItem("/" + part.url, pages);
  }
};

export const cacheScore = async (score: Score, keys: string[]) => {
  try {
    cached.update((s) => {
      s[score.key] = Cache.Working;
    });
    await Promise.all(
      score.parts.map(async (part) => {
        if (!keys.includes("/" + part.url)) {
          return cachePart(part);
        }
      })
    );
    cached.update((s) => {
      s[score.key] = Cache.Success;
    });
  } catch (e) {
    console.log(e);
    cached.update((s) => {
      s[score.key] = Cache.Failed;
    });
  }
};

const getLibraryScores = async (key: string) => {
  const [resource, uid, query] = key.split("/");

  const { data } = await supabase
    .from("library_scores")
    .select("score(key,title,artist,parts)")
    .or(query);

  const scores = data.map((item) => item.score);

  return scores;
};

export const useAllScores = () => {
  const uid = useUid();

  const { libraries } = useLibraries();

  const query = libraries
    .map((library) => `library.eq.${library.key}`)
    .join(",");
  const key = `all-scores/${uid}/${query}`;

  const { data, mutate } = useSWR<Score[]>(() => {
    return uid && query ? key : null;
  }, getLibraryScores);

  return { scores: data || [], mutate };
};

export const useCache = () => {
  const { scores } = useAllScores();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const keys = await cache.keys();
      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        toast.loading(`Processing score ${i + 1} of ${scores.length}`, {
          id: "process",
        });
        await cacheScore(score, keys);
        if (cancelled) {
          break;
        }
      }
      toast.remove("process");
    })();
    return () => {
      cancelled = true;
    };
  }, [scores]);
};
