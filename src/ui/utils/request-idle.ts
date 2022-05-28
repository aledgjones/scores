const shim = (cb: any) => {
  setTimeout(cb, 0);
};

const requestIdleCallback =
  (typeof window !== "undefined" && (window as any).requestIdleCallback) ||
  shim;

export default requestIdleCallback;
