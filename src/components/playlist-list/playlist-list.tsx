import { FC } from "react";
import { PlaylistScore } from "../../services/scores";
import PlaylistItem from "./playlist-item";
import Subheader from "../../ui/components/subheader";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Props {
  listKey: string;
  scores: PlaylistScore[];
  toggled?: string;
  onToggle: (key: string) => void;
  title?: string;
  working: boolean;
  inline?: boolean;
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
}

const PlaylistList: FC<Props> = ({
  listKey,
  scores,
  toggled,
  onToggle,
  title,
  working,
  inline,
  onSortEnd,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = scores.findIndex(
        (score) => score.playlistKey === active.id
      );
      const newIndex = scores.findIndex(
        (score) => score.playlistKey === over.id
      );
      if (onSortEnd) {
        onSortEnd(oldIndex, newIndex);
      }
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
          items={scores.map((score) => score.playlistKey)}
          strategy={verticalListSortingStrategy}
        >
          <div className="playlist-list">
            {title && (
              <Subheader>
                {title} ({scores.length})
              </Subheader>
            )}
            {scores.map((score, index) => (
              <PlaylistItem
                key={score.playlistKey}
                listKey={listKey}
                toggled={toggled}
                onToggle={onToggle}
                score={score}
                working={working}
                inline={inline}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default PlaylistList;
