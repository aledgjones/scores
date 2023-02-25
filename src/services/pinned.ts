import { useEffect, useMemo } from "react";
import { getUserId } from "./auth";
import { Store } from "pullstate";
import localforage from "localforage";
import { DB_NAME } from "./db";
import { useLibraryScores } from "./scores";
import { getStoreName, StoreKeys } from "./cleanup";

export const pinnedStorage = localforage.createInstance({
  name: DB_NAME,
  storeName: getStoreName(StoreKeys.Pinned),
});

type Pinned = { [key: string]: boolean };
export type StoreShape = { [key: string]: boolean };
export const pinnedStore = new Store<StoreShape>({});

export const togglePinned = (libraryKey: string, key: string) => {
  const uid = getUserId();

  if (!uid || !libraryKey || !key) {
    return;
  }

  pinnedStore.update((s) => {
    const { [key]: current, ...others } = s;
    if (current) {
      pinnedStorage.setItem(`pinned/${uid}/${libraryKey}`, others);
      return { ...others };
    } else {
      pinnedStorage.setItem(`pinned/${uid}/${libraryKey}`, {
        ...others,
        [key]: true,
      });
      return {
        ...others,
        [key]: true,
      };
    }
  });
};

const reset = async (libraryKey: string) => {
  const uid = getUserId();

  if (!uid || !libraryKey) {
    return {};
  }

  const stored = await pinnedStorage.getItem<Pinned>(
    `pinned/${uid}/${libraryKey}`
  );
  pinnedStore.update((s) => stored || {});
};

export const useIsPinned = (scoreKey: string) => {
  const pinned = pinnedStore.useState((s) => s);

  return pinned[scoreKey];
};

export const usePinned = (libraryKey: string) => {
  const pinned = pinnedStore.useState((s) => s);
  const { scores } = useLibraryScores(libraryKey);

  return useMemo(() => {
    return scores.filter((score) => {
      return pinned[score.key];
    });
  }, [pinned, scores]);
};

export const usePinnedWorker = (libraryKey: string) => {
  useEffect(() => {
    reset(libraryKey);
  }, [libraryKey]);
};
