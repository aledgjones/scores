import { useEffect } from "react";

export const useWakeLock = () => {
  useEffect(() => {
    (async () => {
      if ("wakeLock" in navigator) {
        let lock = await navigator.wakeLock.request("screen");

        document.addEventListener("visibilitychange", async () => {
          if (document.visibilityState === "visible") {
            lock = await navigator.wakeLock.request("screen");
          }
        });
      }
    })();
  }, []);
};
