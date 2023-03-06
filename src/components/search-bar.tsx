import { FC, useEffect, useMemo, useRef, useState } from "react";
import { mdiClose, mdiCogOutline, mdiMagnify, mdiMenu } from "@mdi/js";
import IconButton from "../ui/components/icon-button";
import Icon from "@mdi/react";
import { openMainDrawer, uiStore } from "../services/ui";
import { useAllScores } from "../services/cache";
import { Score } from "../services/scores";
import fuzzysort from "fuzzysort";
import ScoresList from "./scores-list/scores-list";
import classNames from "classnames";
import { noop } from "../ui/utils/noop";
import { useUserLibraryInvites } from "../services/libraries";
import { Link, useLocation } from "react-router-dom";
import { useUserPlaylistInvites } from "../services/playlists";

interface Props {
  toggled?: string;
  onToggle: (value: string) => void;
}

const SearchBar: FC<Props> = ({ toggled, onToggle }) => {
  const ref = useRef<HTMLDivElement>();
  const location = useLocation();
  const [focused, setFocused] = useState(false);
  const [value, onChange] = useState("");
  const { scores } = useAllScores();
  const { invites: libraryInvites } = useUserLibraryInvites();
  const { invites: playlistInvites } = useUserPlaylistInvites();
  const updateAvailable = uiStore.useState((s) => s.updateAvailable);

  const invites = [...libraryInvites, ...playlistInvites];

  const showDot = invites.length > 0 || updateAvailable;

  useEffect(() => {
    const cb = (e: any) => {
      if (!ref?.current?.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("click", cb, { passive: true });
    return () => {
      document.removeEventListener("click", cb);
    };
  }, [ref]);

  const list: Score[] = useMemo(() => {
    if (value) {
      const keys = ["title", "artist"];
      const sorted = fuzzysort.go(value, scores, { keys, threshold: -1000 });
      return sorted.map((result: any) => {
        const output = { ...result.obj };
        keys.forEach((key, i) => {
          output[key] = result[i]
            ? fuzzysort.highlight(result[i], '<span class="bold">', "</span>")
            : output[key];
        });
        return output;
      });
    } else {
      return [];
    }
  }, [scores, value]);

  const isOpen = value && focused;
  const isEmptySearch = value && list.length === 0;

  return (
    <>
      <div className="search-bar" ref={ref}>
        <div className="search-bar-scrim" />
        <IconButton
          ariaLabel="App Menu"
          className="menu"
          onClick={openMainDrawer}
        >
          <Icon path={mdiMenu} size={1} color="var(--black)" />
          {showDot && <div className="dot" />}
        </IconButton>
        <input
          className={classNames("input", { "input--results": isOpen })}
          type="text"
          placeholder="Search for scores..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        <div className="more">
          {value && (
            <IconButton
              className="clear"
              ariaLabel="clear search"
              onClick={() => onChange("")}
            >
              <Icon path={mdiClose} size={1} />
            </IconButton>
          )}
          {!value && (
            <Icon path={mdiMagnify} size={1} color="rgb(200,200,200)" />
          )}
          <div className="divider" />
          <Link to={`${location.pathname}/settings`}>
            <IconButton
              ariaLabel="Library Settings"
              className="cog"
              onClick={noop}
            >
              <Icon path={mdiCogOutline} size={1} color="var(--black)" />
            </IconButton>
          </Link>
        </div>
        {isOpen && (
          <div className="results">
            {!isEmptySearch && (
              <ScoresList
                title="Search results"
                scores={list}
                listKey="results"
                toggled={toggled}
                onToggle={onToggle}
                inline
              />
            )}
            {isEmptySearch && (
              <div className="empty">
                <img src="/empty.png" width="240" height="180" loading="lazy" />
                <h2 className="empty-title">No search results for '{value}'</h2>
                <p className="empty-text">
                  You don't have any scores that fit your search
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .search-bar {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          padding: 20px;
          z-index: 1000;
          width: 100%;
        }

        .input {
          width: 100%;
          box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28); /* copied from google.com */
          border-radius: 8px;
          padding: 14px 97px 14px 56px;
          z-index: 2;
        }
        .input--results {
          border-radius: 8px 8px 0 0;
        }

        .search-bar :global(.menu) {
          position: absolute;
          left: 32px;
          z-index: 3;
        }

        .search-bar :global(.more) {
          display: flex;
          align-items: center;
          position: absolute;
          right: 32px;
          z-index: 3;
          pointer-events: none;
        }

        .divider {
          height: 28px;
          width: 1px;
          background-color: rgb(200, 200, 200);
          margin: 0 12px;
        }

        .search-bar :global(.clear),
        .search-bar :global(.cog) {
          pointer-events: all;
        }

        .search-bar-scrim {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 66px;
          background-image: linear-gradient(
            rgba(255, 255, 255, 1) 20px,
            rgba(255, 255, 255, 0)
          );
        }
        .results {
          position: absolute;
          top: calc(100% - 20px);
          width: calc(100% - 40px);
          box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28); /* copied from google.com */
          background-color: #fff;
          z-index: 2;
          max-height: 360px;
          overflow: auto;
          border-radius: 0 0 8px 8px;
          padding-bottom: 8px;
          border-top: 1px solid rgb(225, 225, 225);
          clip-path: polygon(
            -20px 0,
            calc(100% + 20px) 0,
            calc(100% + 20px) calc(100% + 20px),
            -20px calc(100% + 20px)
          );
        }
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .empty-title {
          font-weight: bold;
          margin-bottom: 4px;
        }
        .dot {
          position: absolute;
          top: 3px;
          right: 1px;
          height: 15px;
          width: 15px;
          background-color: rgb(var(--primary));
          border-radius: 50%;
          border: 3px solid #fff;
        }
      `}</style>
    </>
  );
};

export default SearchBar;
