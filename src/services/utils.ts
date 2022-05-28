interface Viewport {
  width: number;
  height: number;
}

export const fitAInsideB = (a: Viewport, b: Viewport): number => {
  const tall = Math.min(b.width / a.width, b.height / a.height);
  const wide = Math.min(b.height / a.width, b.width / a.height);
  return Math.max(tall, wide);
};
