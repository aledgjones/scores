import classNames from "classnames";
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
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPositionChange: (x: number, y: number) => void;
  position: { x: number; y: number };
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
  scale,
  onZoomIn,
  onZoomOut,
  onPositionChange,
  position,
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

  const onDraw = (
    e: PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    render();

    const box = canvas.getBoundingClientRect();
    const scale = box.width / canvas.width;

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

  const onDrag = (e: PointerEvent<HTMLCanvasElement>) => {
    const start = { x: e.screenX, y: e.screenY };
    const box = { ...position };

    const onMove = (event) => {
      onPositionChange(
        box.x + event.screenX - start.x,
        box.y + event.screenY - start.y
      );
    };

    const onEnd = () => {
      isActive.current = false;

      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onEnd);
      document.removeEventListener("pointercancel", onEnd);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onEnd);
    document.addEventListener("pointercancel", onEnd);
  };

  const onStart = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!canvas.current || !ready || isActive.current) {
      return false;
    }

    isActive.current = true;

    switch (tool) {
      case Tool.pen:
      case Tool.eraser:
        onDraw(e, canvas.current);
        break;
      default:
        onDrag(e);
        break;
    }
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
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        scale={scale}
      />
      <canvas
        ref={canvas}
        height={(height || 0) * window.devicePixelRatio}
        width={(width || 0) * window.devicePixelRatio}
        className={classNames("whiteboard", {
          "whiteboard--no-transition": isDrawing,
        })}
        onPointerDown={onStart}
      />
      <style jsx>{`
        .whiteboard {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1000;
          transform-origin: 0 0;
          transform: scale(${scale})
            translate(
              calc(-50% + ${position.x / scale}px),
              calc(-50% + ${position.y / scale}px)
            );
          transition: max-height 0.2s, max-width 0.2s, transform 0.2s;
          touch-action: none;
          aspect-ratio: ${width} / ${height};
        }
        .whiteboard--no-transition {
          transition: none;
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
