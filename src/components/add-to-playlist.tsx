import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import { addToPlaylist, usePlaylists } from "../services/playlists";
import { Score } from "../services/scores";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Spinner from "../ui/components/spinner";
import toast from "react-hot-toast";

interface Props {
  score: Score;
  onClose: () => void;
}

const AddToPlaylist: FC<Props> = ({ score, onClose }) => {
  const { playlists } = usePlaylists();
  const [selection, setSelection] = useState("");
  const [working, setWorking] = useState(false);

  const onAdd = async (playlistKey: string) => {
    if (!working) {
      try {
        setSelection(playlistKey);
        setWorking(true);
        await addToPlaylist(playlistKey, score.key);
        onClose();
        toast.success("Added");
      } catch (err) {
        setSelection("");
        setWorking(false);
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <CardContent>
        <h2 className="title">Add to Playlist</h2>
      </CardContent>
      <ul>
        {playlists.map((playlist) => {
          const isActive = selection === playlist.key && working;
          return (
            <li key={playlist.key} onClick={() => onAdd(playlist.key)}>
              <p className="grow">{playlist.name}</p>
              {!isActive && <Icon path={mdiChevronRight} size={1} />}
              {isActive && <Spinner color="rgb(var(--primary))" />}
            </li>
          );
        })}
      </ul>
      <CardContent>
        <div className="buttons">
          <div />
          <Button disabled={working} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
      <style jsx>{`
        .title {
          font-size: 24px;
        }
        ul {
          padding: 0;
          margin: -10px 0;
          list-style: none;
        }
        li {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 30px;
          cursor: pointer;
        }
        li:hover {
          background-color: rgb(245, 245, 245);
        }
        .grow {
          flex-grow: 1;
          margin-right: 20px;
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

export default Modal(AddToPlaylist);
