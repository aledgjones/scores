import { mdiDotsVertical, mdiFilePdfBox } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { FC } from "react";
import { useInView } from "react-intersection-observer";
import { Score } from "../../services/scores";
import IconButton from "../../ui/components/icon-button";
import { openScoreSheet } from "../../services/ui";
import OfflineIndicator from "../offline-indicator";
import { Link, useParams } from "react-router-dom";
import { Cache, useCachedState } from "../../services/cache";

interface Props {
  listKey: string;
  score: Score;
  toggled?: string;
  onToggle: (key: string) => void;
  inline?: boolean;
}

const ScoreItem: FC<Props> = ({
  listKey,
  score,
  toggled,
  onToggle,
  inline,
}) => {
  const { ref, inView } = useInView({ rootMargin: "200px 0px" });
  const toggleKey = `${score.key}-${listKey}`;
  const isToggled = toggled === toggleKey;
  const { libraryKey } = useParams();
  const state = useCachedState(score.key);

  return (
    <>
      <div
        ref={ref}
        className={classNames("wrap", {
          "wrap--open": isToggled,
        })}
      >
        {inView && (
          <div
            onClick={() => {
              if (state === Cache.Success) {
                onToggle(toggleKey);
              }
            }}
            className={classNames("item", { "item--inline": inline })}
          >
            <div className="background" />
            <div className="item-content">
              <OfflineIndicator state={state} />
              <div
                className="info"
                style={{ opacity: state === Cache.Success ? 1 : 0.4 }}
              >
                <p
                  className="title"
                  dangerouslySetInnerHTML={{ __html: score.title }}
                />
                <p
                  className="artist"
                  dangerouslySetInnerHTML={{ __html: score.artist }}
                />
              </div>
              {!inline && (
                <IconButton
                  ariaLabel={`Settings for ${score.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openScoreSheet(libraryKey, score);
                  }}
                >
                  <Icon path={mdiDotsVertical} size={1} />
                </IconButton>
              )}
            </div>
            <div className="parts">
              {score.parts.map((part) => {
                return (
                  <Link
                    to={`/score/${score.key}/${part.key}`}
                    key={part.key}
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
          height: 56px;
          width: 100%;
          cursor: pointer;
          transition: height 0.3s;
        }
        .wrap--open {
          height: 124px;
        }
        .item {
          position: relative;
          height: 100%;
          overflow: hidden;
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
        .item--inline .item-content {
          padding: 0 0 0 16px;
        }
        .info {
          margin: 0 20px;
          width: calc(100% - 96px);
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
      `}</style>
    </>
  );
};

export default ScoreItem;
