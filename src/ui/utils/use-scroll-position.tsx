import { useEffect, useState } from "react";

const useScrollPosition = () => {
  const [top, setTop] = useState<boolean>(true);
  useEffect(() => {
    const cb = () => {
      setTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", cb, { passive: true });

    return () => {
      window.removeEventListener("scroll", cb);
    };
  }, []);
  return top;
};

export default useScrollPosition;
