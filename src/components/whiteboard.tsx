import classNames from "classnames";
import {
  useEffect,
  useRef,
  FC,
  PointerEvent,
  Dispatch,
  SetStateAction,
} from "react";
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

const DPR = window.devicePixelRatio;

interface Props {
  ready: boolean;
  height?: number;
  width?: number;
  isDrawing: boolean;
  tool: Tool;
  scoreKey: string;
  partKey: string;
  page: number;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setDragging: Dispatch<SetStateAction<boolean>>;
  instructions: DrawInstructions;
  setInstructions: Dispatch<SetStateAction<DrawInstructions>>;
  clearHistory: () => void;
  zoom: number;
  color: Color;
}

const Whiteboard: FC<Props> = ({
  ready,
  height,
  width,
  tool,
  isDrawing,
  scoreKey,
  partKey,
  page,
  position,
  setPosition,
  setDragging,
  instructions,
  setInstructions,
  clearHistory,
  zoom,
  color,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const isActive = useRef<boolean>(false);

  // these need to be props
  const thickness = tool === Tool.pen ? DPR : 20 * DPR;

  const render = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        instructions.forEach((instruction) => drawLine(instruction, ctx));
      }
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
    const box = canvas.getBoundingClientRect();

    const point: DrawPoint = [
      (e.clientX - box.left) / box.width,
      (e.clientY - box.top) / box.height,
    ];
    clearHistory();
    setInstructions((state) => {
      return [...state, [tool, color, thickness, [point]]];
    });

    const onMove = (event) => {
      const point: DrawPoint = [
        (event.clientX - box.left) / box.width,
        (event.clientY - box.top) / box.height,
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

    setDragging(true);

    const onMove = (event) => {
      setPosition({
        x: box.x + (event.screenX - start.x) / zoom,
        y: box.y + (event.screenY - start.y) / zoom,
      });
    };

    const onEnd = () => {
      isActive.current = false;

      setDragging(false);

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

  return (
    <>
      <canvas
        ref={canvas}
        height={height || 0}
        width={width || 0}
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
          transform: translate(-50%, -50%);
          transition: max-height 0.2s, max-width 0.2s, transform 0.2s;
          touch-action: none;
          aspect-ratio: ${width} / ${height};
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
