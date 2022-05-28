export const wait = (delay = 400) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
