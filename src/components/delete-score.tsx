import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import { deleteScore, Score, useLibraryScores } from "../services/scores";
import toast from "react-hot-toast";
import { useAllScores } from "../services/cache";

interface Props {
  libraryKey?: string;
  score: Score;
  onClose: () => void;
}

const DeleteScore: FC<Props> = ({ libraryKey, score, onClose }) => {
  const [working, setWorking] = useState(false);
  const { mutate: mutateAll } = useAllScores();
  const { mutate: mutateLibrary } = useLibraryScores(libraryKey);
  const onDelete = async () => {
    try {
      setWorking(true);
      await deleteScore(score);
      mutateAll();
      mutateLibrary();
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
        <h2 className="title">Delete Score</h2>
        <p className="subtitle">
          Are you sure you want to delete '{score.title}'? This cannot be
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

export default Modal(DeleteScore);
