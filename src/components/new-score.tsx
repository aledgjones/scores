import { FC, useState } from "react";
import Modal from "../ui/components/modal";
import CardContent from "../ui/components/card-content";
import Input from "../ui/components/input";
import Button from "../ui/components/button";
import Select from "../ui/components/select";
import Option from "../ui/components/option";
import DropFile from "../ui/components/drop-file";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { chooseFiles } from "../ui/utils/choose-files";
import FilesList, { FileEntry, FileState } from "./files-list/files-list";
import { arrayMoveImmutable as arrayMove } from "array-move";
import { pluralize } from "../ui/utils/pluralize";
import classNames from "classnames";
import shortid from "shortid";
import { createScore, Genre } from "../services/scores";
import toast from "react-hot-toast";

interface Props {
  library: string;
  onCancel: () => void;
  onComplete: () => void;
}

const NewScore: FC<Props> = ({ library, onCancel, onComplete }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState(null);
  const [files, setFiles] = useState<FileEntry[]>([]);

  const [working, setWorking] = useState(false);

  const onCreateCallback = async () => {
    try {
      setWorking(true);
      await createScore(
        library,
        title,
        artist,
        genre,
        files,
        (partKey: string, state: FileState) => {
          setFiles((s) => {
            return s.map((entry) => {
              if (entry.key === partKey) {
                entry.state = state;
              }
              return entry;
            });
          });
        }
      );
      onComplete();
    } catch (err) {
      toast.error(err.message);
      setWorking(false);
    }
  };

  const onCancelCallback = () => {
    onCancel();
  };

  const selectFiles = async () => {
    const { files, discarded } = await chooseFiles({
      accept: ["application/pdf"],
      multiple: true,
    });
    addFiles(files, discarded);
  };

  const addFiles = (files: File[], discarded: number) => {
    if (discarded > 0) {
      toast.error(
        `Sorry, only PDF's are supported at this time, (${discarded} ${pluralize(
          discarded,
          "file",
          "files"
        )} discarded)`
      );
    }
    const newEntries = files.map((file) => {
      return {
        key: shortid(),
        file: file,
        name: "",
        state: FileState.None,
      };
    });

    setFiles((f) => [...f, ...newEntries]);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFiles((items) => {
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const onRemove = (key: string) => {
    setFiles((items) => {
      return items.filter((item) => item.key !== key);
    });
  };

  const onChange = (key: string, value: string) => {
    setFiles((items) => {
      return items.map((item) => {
        if (item.key === key) {
          item.name = value;
        }
        return item;
      });
    });
  };

  return (
    <>
      <DropFile accept={["application/pdf"]} onDrop={addFiles}>
        <CardContent>
          <h2 className="title">New Score</h2>
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(val) => setTitle(val)}
            margin
            disabled={working}
          />
          <Input
            label="Artist"
            type="text"
            value={artist}
            onChange={(val) => setArtist(val)}
            margin
            disabled={working}
          />
          <Select
            disabled={working}
            label="Genre"
            value={genre}
            onChange={(val) => setGenre(val)}
          >
            <Option value={Genre.Classical}>Classical</Option>
            <Option value={Genre.RockAndPop}>Rock &amp; Pop</Option>
            <Option value={Genre.JazzAndSwing}>Jazz &amp; Swing</Option>
            <Option value={Genre.SoulAndFunk}>Soul &amp; Funk</Option>
            <Option value={Genre.FilmAndTheatre}>Film &amp; Theatre</Option>
            <Option value={Genre.Traditional}>Traditional</Option>
            <Option value={Genre.Festive}>Festive</Option>
            <Option value={Genre.Worship}>Worship</Option>
            <Option value={Genre.Other}>Other</Option>
          </Select>
        </CardContent>
        <FilesList
          lockAxis="y"
          transitionDuration={200}
          useDragHandle
          helperClass="ghost"
          files={files}
          working={working}
          onSortEnd={onSortEnd}
          onRemove={onRemove}
          onChange={onChange}
        />
        <button
          disabled={working}
          type="button"
          className={classNames("input", { "input--disabled": working })}
          onClick={selectFiles}
        >
          <Icon path={mdiPlus} size={1} />
          <div className="label">
            <p>Add Part</p>
            <p>Upload a PDF score</p>
          </div>
        </button>
        <CardContent>
          <div className="buttons">
            <Button disabled={working} onClick={onCancelCallback}>
              Cancel
            </Button>
            <Button disabled={working} onClick={onCreateCallback} primary>
              Save
            </Button>
          </div>
        </CardContent>
      </DropFile>
      <style jsx>{`
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .input {
          display: flex;
          align-items: center;
          padding: 12px 30px;
          cursor: pointer;
          width: 100%;
        }
        .input--disabled {
          pointer-events: none;
        }
        .input:hover {
          background-color: rgb(245, 245, 245);
        }
        .label {
          margin-left: 16px;
        }
        .label p:last-child {
          font-size: 0.8em;
          opacity: 0.6;
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

export default Modal(NewScore);
