import classNames from "classnames";
import { FC, useState } from "react";
import {
  DrawInstruction,
  DrawInstructions,
  storeAnnotation,
} from "../services/canvas";
import { Tool } from "../services/ui";
import { Toolbox } from "./toolbox";
import Whiteboard from "./whiteboard";

interface Props {
  src: string;
  overview: boolean;
  isPrevious: boolean;
  isCurrent: boolean;
  isNext: boolean;
  tool: Tool;
  isDrawing: boolean;
  onChange: (tool: Tool) => void;
  onSave: () => void;
  scoreKey: string;
  partKey: string;
  page: number;
}

export const Page: FC<Props> = ({
  src,
  overview,
  tool,
  isDrawing,
  onSave,
  onChange,
  isPrevious,
  isCurrent,
  isNext,
  scoreKey,
  partKey,
  page,
}) => {
  const [ready, setReady] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const [instructions, setInstructions] = useState<DrawInstructions>([]);
  const [history, setHistory] = useState<DrawInstruction[]>([]);

  const onLoad = (e) => {
    setWidth(e.target.width);
    setHeight(e.target.height);
    setReady(true);
  };

  const onZoomIn = () => {
    setScale((s) => {
      return (s * 100 + 50) / 100;
    });
  };

  const onZoomOut = () => {
    setScale((s) => {
      if (s > 1) {
        return (s * 100 - 50) / 100;
      } else {
        return s;
      }
    });
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
      <div
        className={classNames("area", {
          "area--overview": overview,
          previous: isPrevious,
          current: isCurrent,
          next: isNext,
        })}
      >
        <Toolbox
          tool={tool}
          isDrawing={isDrawing}
          onChange={onChange}
          onSave={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            onSave();
          }}
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={instructions.length > 0}
          canRedo={history.length > 0}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          scale={scale}
        />
        <div className="zoom">
          <div className="position">
            {src && (
              <img
                onLoad={onLoad}
                className={classNames("page", {
                  "page--no-transition": isDrawing,
                })}
                src={src}
              />
            )}
            <Whiteboard
              ready={ready}
              tool={tool}
              scoreKey={scoreKey}
              partKey={partKey}
              page={page}
              width={width}
              height={height}
              isDrawing={isDrawing}
              position={position}
              setPosition={setPosition}
              setDragging={setDragging}
              instructions={instructions}
              setInstructions={setInstructions}
              clearHistory={() => setHistory([])}
              scale={scale}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .area {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          pointer-events: none;
          transition: opacity 0.3s, transform 0.3s;
        }
        .zoom {
          height: 100%;
          width: 100%;
          transform-origin: 50% 50%;
          transform: scale(${scale});
          transition: transform 0.2s;
        }
        .position {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          transform: translate(${position.x}px, ${position.y}px);
          transition: ${dragging ? "none" : "transform 0.2s"};
        }
        .page {
          max-height: 100%;
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 5px 0 rgba(25, 25, 25, 0),
            0 3px 4px -2px rgba(25, 25, 25, 0), 0 1px 8px 0 rgba(25, 25, 25, 0);
          transition: box-shadow 0.2s, max-height 0.2s, max-width 0.2s;
        }
        .area--overview .page {
          box-shadow: var(--shadow);
          max-height: calc(100% - 144px);
          max-width: calc(100% - 80px);
        }
        :global(.whiteboard) {
          max-height: 100%;
          max-width: 100%;
        }
        .area--overview :global(.whiteboard) {
          max-height: calc(100% - 144px);
          max-width: calc(100% - 80px);
        }
        .area--overview.current :global(.whiteboard) {
          pointer-events: all;
        }
        .previous {
          opacity: 0;
          transform: translate3d(-40px, 0, 0);
        }
        .current {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        .next {
          opacity: 0;
          transform: translate3d(40px, 0, 0);
        }
      `}</style>
    </>
  );
};
