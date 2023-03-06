import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Button from "../ui/components/button";
import { useNavigate } from "react-router-dom";
import { Score } from "../services/scores";
import { deleteLibrary, Library, useLibraries } from "../services/libraries";
import toast from "react-hot-toast";
import { useAllScores } from "../services/cache";

interface Props {
  library: Library;
  scores: Score[];
  onClose: () => void;
}

const DeleteLibrary: FC<Props> = ({ library, scores, onClose }) => {
  const navigate = useNavigate();
  const [working, setWorking] = useState(false);
  const { mutate: mutateLibraries } = useLibraries();
  const { mutate: mutateAllScores } = useAllScores();
  const onDelete = async () => {
    try {
      setWorking(true);
      await deleteLibrary(library.key, scores);
      await mutateLibraries();
      await mutateAllScores();
      navigate(`/library`);
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
        <h2 className="title">Delete Library</h2>
        <p className="subtitle">
          Are you sure you want to delete '{library.name}'? This cannot be
          undone.
        </p>
        <ul className="margin">
          <li>The library will be deleted</li>
          <li>Scores will be deleted</li>
          <li>Scores will be removed from playlists</li>
        </ul>
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
        .margin {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};

export default Modal(DeleteLibrary);
