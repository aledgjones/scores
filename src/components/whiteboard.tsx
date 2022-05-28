import { useEffect, useRef, FC, PointerEvent, useState } from "react";
import {
  Color,
  DrawInstructions,
  drawLine,
  DrawPoint,
  retreiveAnnotation,
  storeAnnotation,
} from "../services/canvas";
import { Tool } from "../services/ui";
import { useClientsideEffect } from "../ui/utils/use-clientside-effect";

interface Props {
  ready: boolean;
  height?: number;
  width?: number;
  tool: Tool;
  scoreKey: string;
  partKey: string;
  page: number;
}

const Whiteboard: FC<Props> = ({
  ready,
  height,
  width,
  tool,
  scoreKey,
  partKey,
  page,
}) => {
  const canvas = useRef<HTMLCanvasElement>();
  const isActive = useRef<boolean>(false);
  const newPath = useRef<DrawPoint[]>([]);
  const [instructions, setInstructions] = useState<DrawInstructions>([]);

  // these need to be props
  const color = Color.black;
  const thickness = tool === Tool.pen ? 1 : 20;

  const render = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    instructions.forEach((instruction) => drawLine(instruction, ctx));
    drawLine([tool, color, thickness, newPath.current], ctx);

    if (isActive.current) {
      requestAnimationFrame(render);
    }
  };

  useEffect(() => {
    let unmounted = false;
    (async () => {
      const entry = await retreiveAnnotation(scoreKey, partKey, page);
      if (!unmounted) {
        setInstructions(entry);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [scoreKey, partKey, page]);

  useClientsideEffect(() => {
    render();
  }, [canvas, height, width, instructions]);

  const onStart = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!canvas.current || !ready || tool === Tool.cursor || isActive.current) {
      console.log("cancelled");
      return false;
    }

    isActive.current = true;
    render();

    const box = canvas.current.getBoundingClientRect();
    const scale = box.width / canvas.current.width;

    const point: DrawPoint = [
      Math.floor((e.clientX - box.left) / scale),
      Math.floor((e.clientY - box.top) / scale),
    ];
    newPath.current = [point];

    const onMove = (event) => {
      const point: DrawPoint = [
        Math.floor((event.clientX - box.left) / scale),
        Math.floor((event.clientY - box.top) / scale),
      ];
      newPath.current = [...newPath.current, point];
    };

    const onEnd = () => {
      isActive.current = false;
      setInstructions((state) => {
        const next: DrawInstructions = [
          ...state,
          [tool, color, thickness, newPath.current],
        ];
        storeAnnotation(scoreKey, partKey, page, next);
        return next;
      });

      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onEnd);
      document.removeEventListener("pointercancel", onEnd);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onEnd);
    document.addEventListener("pointercancel", onEnd);
  };

  return (
    <>
      <canvas
        ref={canvas}
        height={height}
        width={width}
        className="whiteboard"
        onPointerDown={onStart}
      />
      <style jsx>{`
        .whiteboard {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1000;
          transform: translate(-50%, -50%);
          transition: max-height 0.2s, max-width 0.2s;
          touch-action: none;
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
