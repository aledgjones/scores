import classNames from "classnames";
import { FC } from "react";
import FilesListItem from "./files-list-item";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  size: number;
  state: FileState;
}

interface Props {
  files: FileEntry[];
  working: boolean;
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  onRemove: (key: string) => void;
  onChange: (key: string, name: string) => void;
}

const FilesList: FC<Props> = ({
  files,
  working,
  onSortEnd,
  onRemove,
  onChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = files.findIndex((file) => file.key === active.id);
      const newIndex = files.findIndex((file) => file.key === over.id);
      onSortEnd(oldIndex, newIndex);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((file) => file.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className={classNames("files", { "files--working": working })}>
            {files.map(({ key, file, url, name, state }) => {
              return (
                <FilesListItem
                  key={key}
                  id={key}
                  url={url}
                  file={file}
                  name={name}
                  state={state}
                  onRemove={onRemove}
                  onChange={onChange}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
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

export default FilesList;
