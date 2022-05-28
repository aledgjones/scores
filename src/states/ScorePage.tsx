import { useState } from "react";
import {
  mdiArrowLeft,
  mdiChevronLeft,
  mdiChevronRight,
  mdiDraw,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate, useParams } from "react-router-dom";
import { Tool } from "../services/ui";
import { usePDF } from "../services/pdf";
import IconButton from "../ui/components/icon-button";
import { Toolbox } from "../components/toolbox";
import { Page } from "../components/page";

enum Direction {
  left = "left",
  right = "right",
}

export const ScorePage = () => {
  const navigate = useNavigate();
  const { scoreKey, partKey } = useParams();

  const [page, setPage] = useState(0);
  const [overview, setOverview] = useState(false);
  const [flash, setFlash] = useState<Direction | null>(null);
  const [tool, setTool] = useState(Tool.cursor);
  const [isDrawing, setIsDrawing] = useState(false);

  const { count, pages } = usePDF(scoreKey, partKey);

  const onBack = () => {
    navigate(-1);
  };

  const flashElement = (direction: Direction) => {
    setFlash(direction);
    setTimeout(() => {
      setFlash(null);
    }, 100);
  };

  const onPrev = () => {
    if (page > 0) {
      setPage((p) => p - 1);
    } else {
      flashElement(Direction.left);
    }
  };

  const onNext = () => {
    if (page < count - 1) {
      setPage((p) => p + 1);
    } else {
      flashElement(Direction.right);
    }
  };

  useHotkeys("right", onNext, {}, [onNext]);
  useHotkeys("left", onPrev, {}, [onPrev]);

  return (
    <>
      <Toolbox
        isDrawing={isDrawing}
        tool={tool}
        onChange={setTool}
        onSave={() => {
          setIsDrawing(false);
          setOverview(false);
        }}
      />
      <div className={classNames("view", { "view--overview": overview })}>
        {!isDrawing && (
          <>
            <div
              className={classNames("target-top", {
                "target-top--expand": overview,
              })}
              onClick={() => setOverview((s) => !s)}
            />
            <div
              className={classNames("target-left flasher", {
                "flasher--active": flash === "left",
              })}
              onPointerDown={onPrev}
            />
            <div
              className={classNames("target-right flasher", {
                "flasher--active": flash === "right",
              })}
              onPointerDown={onNext}
            />

            <div
              className={classNames("app-bar", {
                "app-bar--visible": overview,
              })}
            >
              <IconButton ariaLabel="Back to Library" onClick={onBack}>
                <Icon path={mdiArrowLeft} size={1} />
              </IconButton>
              <div className="spacer" />
              <IconButton ariaLabel="Draw" onClick={() => setIsDrawing(true)}>
                <Icon path={mdiDraw} size={1} />
              </IconButton>
            </div>
          </>
        )}

        {[page - 1, page, page + 1].map((index) => {
          if (!pages[index]) {
            return null;
          }

          return (
            <Page
              key={`${scoreKey}/${partKey}/${index}`}
              isPrevious={index < page}
              isCurrent={index === page}
              isNext={index > page}
              src={pages[index]}
              overview={overview}
              tool={tool}
              scoreKey={scoreKey}
              partKey={partKey}
              page={index}
            />
          );
        })}

        {!isDrawing && (
          <div
            className={classNames("navigation", {
              "navigation--visible": overview,
            })}
          >
            <IconButton
              ariaLabel="Previous Page"
              disabled={page === 0}
              onClick={onPrev}
            >
              <Icon path={mdiChevronLeft} size={1} />
            </IconButton>
            <div className="count">
              {page + 1}/{count}
            </div>
            <IconButton
              ariaLabel="Next Page"
              disabled={page >= count - 1}
              onClick={onNext}
            >
              <Icon path={mdiChevronRight} size={1} />
            </IconButton>
          </div>
        )}
      </div>
      <style jsx>{`
        .view {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background-color: white;
          transition: background-color 0.2s;
        }
        .view--overview {
          background-color: rgb(245, 245, 245);
        }
        .app-bar {
          display: flex;
          align-items: center;
          position: fixed;
          top: 0;
          width: 100%;
          height: 72px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s;
          z-index: 1002;
          padding: 0 20px;
        }
        .app-bar--visible {
          pointer-events: all;
          opacity: 1;
          transition: opacity 0.1s 0.1s;
        }
        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          bottom: 0;
          width: 100%;
          padding: 20px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s;
          z-index: 1002;
        }
        .navigation--visible {
          pointer-events: all;
          opacity: 1;
          transition: opacity 0.1s 0.1s;
        }
        .count {
          margin: 0 20px;
          min-width: 45px;
          text-align: center;
        }
        .target-top {
          position: fixed;
          top: 0;
          left: 0;
          height: 72px;
          width: 100vw;
          z-index: 1001;
        }
        .target-top--expand {
          height: 100vh;
        }
        .target-left {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 200px;
          z-index: 1000;
        }
        .target-right {
          position: fixed;
          top: 0;
          left: 200px;
          height: 100vh;
          width: calc(100vw - 200px);
          z-index: 1000;
        }
        .flasher {
          transition: background-color 1s;
          background-color: rgba(0, 0, 0, 0);
        }
        .flasher--active {
          transition: background-color 0s;
          background-color: rgba(100, 100, 100, 0.1);
        }
        .spacer {
          flex-grow: 1;
        }
      `}</style>
    </>
  );
};
