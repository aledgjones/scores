import localforage from "localforage";
import { getUserUid } from "./auth";
import { DB_NAME } from "./db";
import { Tool } from "./ui";

export type XCoord = number;
export type YCoord = number;
export type Width = number;
export enum Color {
  black = "black",
  red = "red",
  green = "green",
  blue = "blue",
}

export type DrawPoint = [XCoord, YCoord];
export type DrawInstruction = [Tool, Color, Width, DrawPoint[]];
export type DrawInstructions = DrawInstruction[];

export const annotations = localforage.createInstance({
  name: DB_NAME,
  storeName: "annotations-v1",
});

export const drawLine = (
  instruction: DrawInstruction,
  ctx: CanvasRenderingContext2D
) => {
  const [tool, color, width, points] = instruction;

  if (tool === Tool.eraser) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    if (i === 0) {
      ctx.moveTo(x * ctx.canvas.width, y * ctx.canvas.height);
    } else {
      ctx.lineTo(x * ctx.canvas.width, y * ctx.canvas.height);
    }
  }
  ctx.stroke();
};

export const storeAnnotation = async (
  scoreKey: string,
  partKey: string,
  page: number,
  instructions: DrawInstructions
) => {
  const uid = getUserUid();
  await annotations.setItem(
    `annotation/${uid}/${scoreKey}/${partKey}/${page}`,
    instructions
  );
};

export const retreiveAnnotation = async (
  scoreKey: string,
  partKey: string,
  page: number
): Promise<DrawInstructions> => {
  const uid = getUserUid();
  return (
    (await annotations.getItem(
      `annotation/${uid}/${scoreKey}/${partKey}/${page}`
    )) || []
  );
};
