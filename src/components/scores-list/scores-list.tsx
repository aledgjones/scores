import { FC } from "react";
import { Score } from "../../services/scores";
import ScoreItem from "./score-item";
import Subheader from "../../ui/components/subheader";

interface Props {
  listKey: string;
  scores: Score[];
  title: string;
  toggled?: string;
  onToggle: (key: string) => void;
  inline?: boolean;
}

const ScoresList: FC<Props> = ({
  listKey,
  scores,
  toggled,
  onToggle,
  title,
  inline,
}) => {
  if (scores.length === 0) {
    return null;
  }

  return (
    <>
      <div className="scores-list">
        {title && (
          <Subheader inline={inline}>
            {title} ({scores.length})
          </Subheader>
        )}
        {scores.map((score) => (
          <ScoreItem
            key={score.key}
            listKey={listKey}
            toggled={toggled}
            onToggle={onToggle}
            score={score}
            inline={inline}
          />
        ))}
      </div>
    </>
  );
};

export default ScoresList;
