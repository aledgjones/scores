import { useState } from "react";
import {
  mdiArrowLeft,
  mdiChevronLeft,
  mdiChevronRight,
  mdiDraw,
  mdiPlaylistMusicOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaylistScores } from "../services/scores";
import {
  closePlaylistSheet,
  openPlaylistSheet,
  Tool,
  ui,
} from "../services/ui";
import { usePDF } from "../services/pdf";
import IconButton from "../ui/components/icon-button";
import { Page } from "../components/page";

enum Direction {
  left = "left",
  right = "right",
}

export const PlaylistKeyScore = () => {
  const navigate = useNavigate();
  const { playlistKey, playlistScoreKey, scoreKey, partKey } = useParams();

  const { scores } = usePlaylistScores(playlistKey);

  const [page, setPage] = useState(0);
  const [overview, setOverview] = useState(false);
  const drawOpen = ui.useState((s) => s.playlistSheet.open);
  const [flash, setFlash] = useState<Direction | null>(null);
  const [tool, setTool] = useState(Tool.cursor);
  const [isDrawing, setIsDrawing] = useState(false);

  const { count, pages } = usePDF(scoreKey, partKey, () => {
    setPage(0);
    setOverview(false);
    closePlaylistSheet();
  });

  const flashElement = (direction: Direction) => {
    setFlash(direction);
    setTimeout(() => {
      setFlash(null);
    }, 100);
  };

  const onBack = () => {
    navigate(-1);
  };

  const onPrev = () => {
    if (drawOpen) {
      closePlaylistSheet();
    } else if (page > 0) {
      setPage((p) => p - 1);
    } else {
      flashElement(Direction.left);
    }
  };

  const onNext = () => {
    if (page < count - 1) {
      setPage((p) => p + 1);
    } else {
      const i = scores.findIndex((s) => s.playlistKey === playlistScoreKey);
      const key = i < scores.length - 1 ? scores[i + 1].playlistKey : undefined;
      openPlaylistSheet(playlistKey, key);
    }
  };

  useHotkeys("right", onNext, {}, [onNext]);
  useHotkeys("left", onPrev, {}, [onPrev]);

  return (
    <>
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
            <div className="target-right flasher" onPointerDown={onNext} />

            <div
              className={classNames("app-bar", {
                "app-bar--visible": overview,
              })}
            >
              <IconButton ariaLabel="Back to Library" onClick={onBack}>
                <Icon path={mdiArrowLeft} size={1} />
              </IconButton>
              <div className="spacer" />
              <IconButton
                margin
                ariaLabel="Draw"
                onClick={() => setIsDrawing(true)}
              >
                <Icon path={mdiDraw} size={1} />
              </IconButton>
              <IconButton
                ariaLabel="Playlist scores"
                onClick={() => openPlaylistSheet(playlistKey)}
              >
                <Icon path={mdiPlaylistMusicOutline} size={1} />
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
              isDrawing={isDrawing}
              scoreKey={scoreKey}
              partKey={partKey}
              page={index}
              onChange={setTool}
              onSave={() => {
                setIsDrawing(false);
                setOverview(false);
              }}
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
