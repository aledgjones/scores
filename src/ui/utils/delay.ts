import { useEffect, useState } from "react";

export const delayFalse = (value: boolean, delay = 500) => {
  const [out, setOut] = useState(value);

  useEffect(() => {
    if (value) {
      setOut(value);
    } else {
      const timer = setTimeout(() => {
        setOut(false);
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value]);

  return out;
};

export const delayTrue = (value: boolean, delay = 300) => {
  const [out, setOut] = useState(value);

  useEffect(() => {
    if (!value) {
      setOut(value);
    } else {
      const timer = setTimeout(() => {
        setOut(true);
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value]);

  return out;
};
