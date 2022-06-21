import {
  mdiAlertCircle,
  mdiCheckCircle,
  mdiClose,
  mdiDrag,
  mdiPaperclip,
} from "@mdi/js";
import { FC } from "react";
import IconButton from "../../ui/components/icon-button";
import Icon from "@mdi/react";
import { FileState } from "./files-list";
import Spinner from "../../ui/components/spinner";
import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";

interface Props {
  id: string;
  file: File;
  name: string;
  state: FileState;
  onRemove: (key: string) => void;
  onChange: (key: string, name: string) => void;
}

const FilesListItem: FC<Props> = ({
  id,
  file,
  name,
  state,
  onRemove,
  onChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <>
      <div
        className="entry"
        ref={setNodeRef}
        style={{
          transform: transform?.y ? `translateY(${transform.y}px)` : undefined,
          transition,
        }}
        {...attributes}
      >
        <Icon
          {...listeners}
          className={classNames("file-handle")}
          path={mdiDrag}
          size={1}
          color="rgb(150,150,150)"
          style={{ cursor: "grab" }}
        />
        <div className="meta">
          <input
            value={name}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder="Part Name"
          />
          <div className="file">
            <Icon path={mdiPaperclip} size={0.5} style={{ minWidth: 12 }} />
            <p className="name">{file.name}</p>
          </div>
        </div>
        {(() => {
          switch (state) {
            case FileState.Uploading:
              return <Spinner size={24} color="rgb(var(--primary))" />;
            case FileState.Error:
              return (
                <Icon
                  path={mdiAlertCircle}
                  size={1}
                  color="rgb(var(--error))"
                />
              );
            case FileState.Complete:
              return (
                <Icon
                  path={mdiCheckCircle}
                  size={1}
                  color="rgb(var(--primary))"
                />
              );
            default:
              return (
                <IconButton
                  ariaLabel="Remove Part"
                  onClick={() => onRemove(id)}
                >
                  <Icon path={mdiClose} size={1} />
                </IconButton>
              );
          }
        })()}
      </div>
      <style jsx>{`
        .entry {
          display: flex;
          align-items: center;
          padding: 10px 15px;
        }
        .meta {
          margin: 0 16px;
          width: calc(100% - 88px);
        }
        input {
          margin-bottom: 6px;
        }
        .file {
          display: flex;
          align-items: center;
          opacity: 0.6;
          margin-left: -2px;
        }
        .name {
          font-size: 12px;
          margin-left: 4px;
        }
        .entry :global(.file-handle) {
          min-width: 24px;
        }
      `}</style>
    </>
  );
};

export default FilesListItem;
