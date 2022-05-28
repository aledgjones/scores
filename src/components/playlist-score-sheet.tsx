import { mdiChevronDown, mdiTagOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { removeFromPlaylist } from "../services/playlists";
import { PlaylistScore, usePlaylistScores } from "../services/scores";
import { openAddLabel } from "../services/ui";
import BottomSheet from "../ui/components/bottom-sheet";
import CardContent from "../ui/components/card-content";
import Divider from "../ui/components/divider";

interface Props {
  score?: PlaylistScore;
  onClose: () => void;
}

const PlaylistScoreSheet: FC<Props> = ({ score, onClose }) => {
  const { playlistKey } = useParams();
  const { scores, mutate } = usePlaylistScores(playlistKey);

  const onRemove = async () => {
    try {
      const data = scores.filter(
        (item) => score.playlistKey !== item.playlistKey
      );
      mutate(data, false);
      await removeFromPlaylist(score.playlistKey);
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
    onClose();
  };

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
        <li
          onClick={() => {
            openAddLabel(score);
            onClose();
          }}
        >
          <Icon className="action" path={mdiTagOutline} size={1} />
          <p>Edit Label</p>
        </li>
        <li onClick={onRemove}>
          <Icon className="action" path={mdiTrashCanOutline} size={1} />
          <p>Remove from playlist</p>
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

export default BottomSheet(PlaylistScoreSheet);
