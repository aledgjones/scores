import localforage from "localforage";
import { useAsync } from "react-use";
import { DB_NAME } from "./db";

export enum StoreKeys {
  Annotations = "annotations",
  LastLibrary = "last-library",
  Pinned = "pinned",
  ScoreCache = "score-cache",
}

export const STORE_VERSIONS = new Map([
  [StoreKeys.Annotations, 1],
  [StoreKeys.LastLibrary, 1],
  [StoreKeys.Pinned, 1],
  [StoreKeys.ScoreCache, 4],
]);

export const getStoreName = (key: StoreKeys) => {
  const version = STORE_VERSIONS.get(key);
  return `${key}-v${version}`;
};

const cleanup = async (key: string, version: number) => {
  await localforage.dropInstance({
    name: DB_NAME,
    storeName: `${key}-v${version}`,
  });
};

export const useCleanupWorker = () => {
  useAsync(async () => {
    const entries = STORE_VERSIONS.entries();
    for (const [key, version] of entries) {
      for (let i = 1; i < version; i++) {
        await cleanup(key, i);
      }
    }
  }, []);
};
