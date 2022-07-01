import {
  mdiDotsVertical,
  mdiDrag,
  mdiFilePdfBox,
  mdiTagOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { FC } from "react";
import { useInView } from "react-intersection-observer";
import { PlaylistScore } from "../../services/scores";
import IconButton from "../../ui/components/icon-button";
import { openPlaylistScoreSheet } from "../../services/ui";
import Tag from "../../ui/components/tag";
import { Link, useParams } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";

interface Props {
  listKey: string;
  score: PlaylistScore;
  toggled?: string;
  onToggle: (key: string) => void;
  working: boolean;
  inline?: boolean;
}

const PlaylistItem: FC<Props> = ({
  listKey,
  score,
  toggled,
  onToggle,
  working,
  inline,
}) => {
  const { ref, inView } = useInView({ rootMargin: "200px 0px" });
  const toggleKey = `${score.playlistKey}-${listKey}`;
  const isToggled = toggled === toggleKey;
  const { playlistKey } = useParams();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: score.playlistKey });

  console.log(transition);

  return (
    <>
      <div
        ref={ref}
        className={classNames("wrap", {
          "wrap--open": isToggled,
          "wrap--inline": inline,
        })}
        style={{
          transform: transform?.y ? `translateY(${transform.y}px)` : undefined,
          transition: `${transition}, height .3s`,
        }}
        {...attributes}
      >
        {inView && (
          <div
            ref={setNodeRef}
            onClick={() => onToggle(toggleKey)}
            className="item"
          >
            <div className="background" />
            <div className="item-content">
              {!inline && (
                <Icon
                  {...listeners}
                  className={classNames("playlist-handle", {
                    "playlist-handle--disabled": working,
                  })}
                  path={mdiDrag}
                  size={1}
                  color="rgb(150,150,150)"
                  style={{ cursor: "grab" }}
                />
              )}
              <div className="info">
                <p
                  className="title"
                  dangerouslySetInnerHTML={{ __html: score.title }}
                />
                <p
                  className="artist"
                  dangerouslySetInnerHTML={{ __html: score.artist }}
                />
              </div>
              {score.tag && (
                <Tag path={mdiTagOutline} margin>
                  {score.tag}
                </Tag>
              )}
              {!inline && (
                <IconButton
                  ariaLabel={`Settings for ${score.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPlaylistScoreSheet(score);
                  }}
                >
                  <Icon path={mdiDotsVertical} size={1} />
                </IconButton>
              )}
            </div>
            <div className="parts">
              {score.parts.map((part, i) => {
                return (
                  <Link
                    to={`/playlist/${playlistKey}/${score.playlistKey}/${score.key}/${part.key}`}
                    key={part.key}
                    replace={inline}
                    className="part"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon
                      path={mdiFilePdfBox}
                      color="rgb(var(--error))"
                      size={1}
                    />
                    <span className="text">{part.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .wrap {
          position: relative;
          height: 56px;
          cursor: pointer;
          background-color: #fff;
        }
        .wrap[aria-pressed] {
          box-shadow: var(--shadow);
          z-index: 10;
        }
        .wrap--open {
          height: 124px;
        }
        .item {
          position: relative;
          height: 100%;
          overflow: hidden;
          touch-action: none;
        }
        .background {
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgb(245, 245, 245);
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .wrap--open .background {
          opacity: 1;
        }
        .item-content {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 32px 0 35px;
          height: 56px;
          z-index: 1;
        }
        .wrap--inline .item-content {
          padding: 0 8px;
        }
        .info {
          margin: 0 20px;
          flex-grow: 1;
        }
        .index {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          width: 24px;
          height: 24px;
          text-align: center;
          border: 2px solid rgb(var(--secondary));
          background: #fff;
          border-radius: 50%;
          color: rgb(var(--secondary));
          line-height: 1em;
          box-shadow: var(--shadow);
        }
        .artist {
          opacity: 0.6;
          font-size: 0.8em;
        }
        .parts {
          position: relative;
          z-index: 1;
          display: block;
          white-space: nowrap;
          padding: 8px 0 20px 76px;
          overflow-x: auto;
          overflow-y: hidden;
          opacity: 0;
          transition: opacity 0.1s;
        }
        .wrap--inline .parts {
          padding: 8px 0 20px 28px;
        }
        .wrap--open .parts {
          opacity: 1;
          transition: opacity 0.2s 0.1s;
        }
        .item :global(.part) {
          display: inline-flex;
          align-items: center;
          margin-right: 12px;
          padding: 8px 20px 8px 16px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: var(--shadow);
          cursor: pointer;
        }
        .part:last-child {
          margin-right: 30px;
        }
        .text {
          margin-left: 8px;
          font-size: 16px;
        }
        .info :global(.bold) {
          font-weight: bold;
        }
        .title,
        .artist {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item :global(.playlist-handle) {
          min-width: 24px;
        }
        .item :global(.playlist-handle--disabled) {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default PlaylistItem;
