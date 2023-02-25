import localforage from "localforage";
import { getUserId, UserId } from "./auth";
import { DB_NAME } from "./db";
import { Tool } from "./ui";

export type XCoord = number;
export type YCoord = number;
export type Width = number;
export enum Color {
  black = "#000000",
  bluegrey = "#607d8b",
  blue = "#1e96f2",
  purple = "#673ab7",
  red = "#f44336",
  orange = "#ff9800",
  green = "#4caf50",
  brown = "#795648",
}
export const colors = [
  { label: "Black", color: Color.black },
  { label: "Blue-grey", color: Color.bluegrey },
  { label: "Brown", color: Color.brown },
  { label: "Red", color: Color.red },
  { label: "Blue", color: Color.blue },
  { label: "Green", color: Color.green },
  { label: "Orange", color: Color.orange },
];

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
  const uid = getUserId();

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
  const uid = getUserId();

  return (
    (await annotations.getItem(
      `annotation/${uid}/${scoreKey}/${partKey}/${page}`
    )) || []
  );
};
