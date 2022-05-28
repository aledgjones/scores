import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Button from "../ui/components/button";
import { createPlaylist, Playlist, usePlaylists } from "../services/playlists";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  playlist?: Playlist;
  onClose: () => void;
}

const NewPlaylist: FC<Props> = ({ onClose, playlist }) => {
  const navigate = useNavigate();
  const { mutate } = usePlaylists();

  const [name, setName] = useState(playlist?.name || "");

  const onCreate = async () => {
    try {
      const key = await createPlaylist(name);
      mutate();
      navigate(`/playlist/${key}`);
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <CardContent>
        <h2 className="title">
          {playlist ? "Update Playlist" : "New Playlist"}
        </h2>
        <Input
          label="Playlist Name"
          type="text"
          value={name}
          onChange={(val) => setName(val)}
          margin
        />
        <div className="buttons">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onCreate} primary>
            Create
          </Button>
        </div>
      </CardContent>
      <style jsx>{`
        .title {
          font-size: 24px;
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

export default Modal(NewPlaylist);
