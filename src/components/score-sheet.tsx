import {
  mdiChevronDown,
  mdiPencilOutline,
  mdiPlaylistMusicOutline,
  mdiStarOutline,
  mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";
import { Score, usePinnedState } from "../services/scores";
import {
  openAddToPlaylist,
  openDeleteScore,
  openEditScore,
} from "../services/ui";
import BottomSheet from "../ui/components/bottom-sheet";
import CardContent from "../ui/components/card-content";
import Divider from "../ui/components/divider";
import Switch from "../ui/components/switch";

interface Props {
  libraryKey?: string;
  score?: Score;
  onClose: () => void;
}

const ScoreSheet: FC<Props> = ({ libraryKey, score, onClose }) => {
  const { pinned, toggle } = usePinnedState();

  const isPinned = pinned[score.key];

  return (
    <>
      <div className="score-sheet" onClick={onClose}>
        <CardContent className="header">
          <div className="meta">
            <p className="title">{score.title}</p>
            <p className="artist">{score.artist}</p>
          </div>
          <Icon path={mdiChevronDown} size={1} />
        </CardContent>
      </div>
      <Divider />
      <ul>
        <li onClick={() => toggle(libraryKey, score.key)}>
          <Icon className="action" path={mdiStarOutline} size={1} />
          <p className="grow">Pinned</p>
          <Switch value={isPinned} />
        </li>
        <li
          onClick={async () => {
            openAddToPlaylist(score);
            onClose();
          }}
        >
          <Icon className="action" path={mdiPlaylistMusicOutline} size={1} />
          <p>Add To Playlist</p>
        </li>
        <li
          onClick={async () => {
            openEditScore(libraryKey, score);
            onClose();
          }}
        >
          <Icon className="action" path={mdiPencilOutline} size={1} />
          <p>Edit Score</p>
        </li>
        <li
          onClick={async () => {
            openDeleteScore(libraryKey, score);
            onClose();
          }}
        >
          <Icon className="action" path={mdiTrashCanOutline} size={1} />
          <p>Delete Score</p>
        </li>
      </ul>

      <style jsx>{`
        .score-sheet {
          cursor: pointer;
        }
        .score-sheet :global(.header) {
          display: flex;
          align-items: center;
        }
        .meta {
          flex-grow: 1;
          padding-right: 8px;
        }
        .title {
          font-size: 20px;
        }
        .artist {
          opacity: 0.6;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 18px 0;
        }
        li {
          display: flex;
          align-items: center;
          padding: 8px 30px;
          height: 48px;
          cursor: pointer;
        }
        li:hover {
          background-color: rgb(245, 245, 245);
        }
        li :global(.action) {
          margin-right: 16px;
          color: rgb(var(--primary));
        }
        .grow {
          flex-grow: 1;
        }
      `}</style>
    </>
  );
};

export default BottomSheet(ScoreSheet);
