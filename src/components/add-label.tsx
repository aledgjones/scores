import { useState, FC } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Button from "../ui/components/button";
import toast from "react-hot-toast";
import { PlaylistScore, usePlaylistScores } from "../services/scores";
import { updateTag } from "../services/playlists";
import { useParams } from "react-router-dom";

interface Props {
  score: PlaylistScore;
  onClose: () => void;
}

const AddLabel: FC<Props> = ({ onClose, score }) => {
  const { playlistKey } = useParams();
  const { mutate } = usePlaylistScores(playlistKey);
  const [label, setLabel] = useState(score.tag);
  const [working, setWorking] = useState(false);

  const onUpdate = async () => {
    try {
      setWorking(true);
      await updateTag(score.playlistKey, label);
      mutate();
      onClose();
    } catch (err) {
      setWorking(false);
      toast.error(err.message);
    }
  };

  return (
    <>
      <CardContent>
        <h2 className="title">Update Label</h2>
        <Input
          label="Label"
          type="text"
          value={label}
          onChange={(val) => setLabel(val)}
          margin
          disabled={working}
          autoFocus
          clearable
        />
        <div className="buttons">
          <Button disabled={working} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={working} onClick={onUpdate} primary>
            Update
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

export default Modal(AddLabel);
