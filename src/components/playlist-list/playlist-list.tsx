import { FC } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { PlaylistScore } from "../../services/scores";
import PlaylistItem from "./playlist-item";
import Subheader from "../../ui/components/subheader";

interface Props {
  listKey: string;
  scores: PlaylistScore[];
  toggled?: string;
  onToggle: (key: string) => void;
  title?: string;
  working: boolean;
  inline?: boolean;
}

const PlaylistList: FC<Props> = ({
  listKey,
  scores,
  toggled,
  onToggle,
  title,
  working,
  inline,
}) => {
  return (
    <>
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
            index={index}
            working={working}
            inline={inline}
          />
        ))}
      </div>
    </>
  );
};

export default SortableContainer<Props>(PlaylistList);
