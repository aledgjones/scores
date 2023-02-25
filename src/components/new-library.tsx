import { useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Button from "../ui/components/button";
import {
  createLibrary,
  Library,
  updateLibrary,
  useLibraries,
} from "../services/libraries";
import { FC } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../services/auth";

interface Props {
  library?: Library;
  onClose: () => void;
}

const NewLibrary: FC<Props> = ({ library, onClose }) => {
  const navigate = useNavigate();
  const { mutate } = useLibraries();

  const [name, setName] = useState(library?.name || "");

  const onCreate = async () => {
    try {
      if (library) {
        await updateLibrary(library.key, name);
      } else {
        const uid = getUserId();
        const key = await createLibrary(uid, name);
        navigate(`/library/${key}`);
      }
      mutate();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <CardContent>
        <h2 className="title">{library ? "Rename Library" : "New Library"}</h2>
        <Input
          label="Library Name"
          type="text"
          value={name}
          onChange={(val) => setName(val)}
          margin
        />
        <div className="buttons">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onCreate} primary>
            {library ? "Update" : "Create"}
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

export default Modal(NewLibrary);
