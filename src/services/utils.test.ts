import { fitAInsideB } from "./utils";

describe("fitAinsideB scales to bigest needed", () => {
  it.each([
    [
      "vertical: no transform",
      { width: 1, height: 2 },
      { width: 1, height: 2 },
      1,
    ],
    [
      "vertical: shrink to height",
      { width: 1, height: 4 },
      { width: 1, height: 2 },
      0.5,
    ],
    [
      "vertical: keep width",
      { width: 1, height: 2 },
      { width: 1, height: 3 },
      1,
    ],
    [
      "vertical: shrink to width",
      { width: 2, height: 2 },
      { width: 1, height: 2 },
      0.5,
    ],
    [
      "vertical: shrink to width",
      { width: 4, height: 1 },
      { width: 1, height: 2 },
      0.5,
    ],

    [
      "horizontal: no transform",
      { width: 1, height: 2 },
      { width: 1, height: 2 },
      1,
    ],
    [
      "horizontal: shrink to height",
      { width: 1, height: 4 },
      { width: 2, height: 1 },
      0.5,
    ],
    [
      "horizontal: keep width",
      { width: 1, height: 2 },
      { width: 3, height: 1 },
      1,
    ],
    [
      "horizontal: shrink to width",
      { width: 2, height: 2 },
      { width: 2, height: 1 },
      0.5,
    ],
    [
      "horizontal: shrink to width",
      { width: 4, height: 1 },
      { width: 2, height: 1 },
      0.5,
    ],
  ])("%s", (label, a, b, expected) => {
    const result = fitAInsideB(a, b);
    expect(expected).toBe(result);
  });
});
