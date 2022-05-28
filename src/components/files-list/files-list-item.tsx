import {
  mdiAlertCircle,
  mdiCheckCircle,
  mdiClose,
  mdiPaperclip,
} from "@mdi/js";
import { FC } from "react";
import { SortableElement } from "react-sortable-hoc";
import Handle from "../handle";
import IconButton from "../../ui/components/icon-button";
import Icon from "@mdi/react";
import { FileState } from "./files-list";
import Spinner from "../../ui/components/spinner";

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
  return (
    <>
      <div className="entry">
        <Handle />
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
        .ghost {
          z-index: 20000;
          box-shadow: var(--shadow-hover);
          background-color: #fff;
          border-radius: 8px;
          pointer-events: all !important;
          cursor: grab !important;
        }
        .ghost :global(*) {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default SortableElement<Props>(FilesListItem);
