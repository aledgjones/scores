import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import toast from "react-hot-toast";
import { deletePlaylist, Playlist, usePlaylists } from "../services/playlists";
import { useNavigate } from "react-router-dom";

interface Props {
  playlist: Playlist;
  onClose: () => void;
}

const DeletePlaylist: FC<Props> = ({ playlist, onClose }) => {
  const navigate = useNavigate();
  const [working, setWorking] = useState(false);
  const { mutate: mutateAll } = usePlaylists();
  const onDelete = async () => {
    try {
      setWorking(true);
      await deletePlaylist(playlist.key);
      navigate(`/library`);
      mutateAll();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
    setWorking(false);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <>
      <CardContent>
        <h2 className="title">Delete Playlist</h2>
        <p className="subtitle">
          Are you sure you want to delete '{playlist.name}'? This cannot be
          undone.
        </p>
        <div className="buttons">
          <Button disabled={working} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={working} onClick={onDelete} primary>
            Delete
          </Button>
        </div>
      </CardContent>
      <style jsx>{`
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .subtitle {
          margin-bottom: 20px;
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

export default Modal(DeletePlaylist);
