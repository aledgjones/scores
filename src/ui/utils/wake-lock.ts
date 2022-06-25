import { useEffect } from "react";

const tryLock = async () => {
  try {
    await navigator.wakeLock.request("screen");
  } catch (e) {
    console.log(e);
  }
};

export const useWakeLock = () => {
  useEffect(() => {
    if ("wakeLock" in navigator) {
      tryLock();

      document.addEventListener("visibilitychange", async () => {
        if (document.visibilityState === "visible") {
          tryLock();
        }
      });
    }
  }, []);
};
