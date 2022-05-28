import classNames from "classnames";
import { FC } from "react";
import { SortableContainer } from "react-sortable-hoc";
import FilesListItem from "./files-list-item";

export enum FileState {
  None,
  Uploading,
  Complete,
  Error,
}

export interface FileEntry {
  key: string;
  file?: File;
  url?: string;
  name: string;
  state: FileState;
}

interface Props {
  files: FileEntry[];
  working: boolean;
  onRemove: (key: string) => void;
  onChange: (key: string, name: string) => void;
}

const FilesList: FC<Props> = ({ files, working, onRemove, onChange }) => {
  return (
    <>
      <div className={classNames("files", { "files--working": working })}>
        {files.map(({ key, file, name, state }, index) => {
          return (
            <FilesListItem
              key={key}
              id={key}
              index={index}
              file={file}
              name={name}
              state={state}
              onRemove={onRemove}
              onChange={onChange}
            />
          );
        })}
      </div>
      <style jsx>{`
        .files {
          padding: 0 15px;
        }
        .files--working {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default SortableContainer<Props>(FilesList);
