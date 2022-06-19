import { useEffect, useRef, FC, PointerEvent, useState } from "react";
import {
  Color,
  DrawInstruction,
  DrawInstructions,
  drawLine,
  DrawPoint,
  retreiveAnnotation,
  storeAnnotation,
} from "../services/canvas";
import { Tool } from "../services/ui";
import { useClientsideEffect } from "../ui/utils/use-clientside-effect";
import { Toolbox } from "./toolbox";

interface Props {
  ready: boolean;
  height?: number;
  width?: number;
  isDrawing: boolean;
  tool: Tool;
  scoreKey: string;
  partKey: string;
  page: number;
  onChange: (tool: Tool) => void;
  onSave: () => void;
}

const Whiteboard: FC<Props> = ({
  ready,
  height,
  width,
  tool,
  isDrawing,
  onChange,
  onSave,
  scoreKey,
  partKey,
  page,
}) => {
  const canvas = useRef<HTMLCanvasElement>();
  const isActive = useRef<boolean>(false);
  const [instructions, setInstructions] = useState<DrawInstructions>([]);
  const [history, setHistory] = useState<DrawInstruction[]>([]);

  // these need to be props
  const color = Color.black;
  const thickness =
    tool === Tool.pen ? window.devicePixelRatio : 20 * window.devicePixelRatio;

  const render = () => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      instructions.forEach((instruction) => drawLine(instruction, ctx));
    }

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
    setHistory([]);
    setInstructions((state) => {
      return [...state, [tool, color, thickness, [point]]];
    });

    const onMove = (event) => {
      const point: DrawPoint = [
        Math.floor((event.clientX - box.left) / scale),
        Math.floor((event.clientY - box.top) / scale),
      ];
      setInstructions((state) => {
        state[state.length - 1][3].push(point);
        return state;
      });
    };

    const onEnd = () => {
      isActive.current = false;
      setInstructions((state) => {
        storeAnnotation(scoreKey, partKey, page, state);
        return state;
      });

      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onEnd);
      document.removeEventListener("pointercancel", onEnd);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onEnd);
    document.addEventListener("pointercancel", onEnd);
  };

  const onUndo = () => {
    setHistory((state) => {
      return [...state, ...instructions.slice(-1)];
    });
    setInstructions((state) => {
      const next = state.slice(0, -1);
      storeAnnotation(scoreKey, partKey, page, next);
      return next;
    });
  };

  const onRedo = () => {
    setInstructions((state) => {
      const next = [...state, ...history.slice(-1)];
      storeAnnotation(scoreKey, partKey, page, next);
      return next;
    });
    setHistory((state) => {
      return state.slice(0, -1);
    });
  };

  return (
    <>
      <Toolbox
        tool={tool}
        isDrawing={isDrawing}
        onChange={onChange}
        onSave={onSave}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={instructions.length > 0}
        canRedo={history.length > 0}
      />
      <canvas
        ref={canvas}
        height={(height || 0) * window.devicePixelRatio}
        width={(width || 0) * window.devicePixelRatio}
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
          aspect-ratio: ${width} / ${height};
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
