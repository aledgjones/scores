import { useState } from "react";
import Fab from "../ui/components/fab";
import { mdiPlus } from "@mdi/js";
import { useLibraryScores, usePinned } from "../services/scores";
import { useAllScores } from "../services/cache";
import { useLibrary } from "../services/libraries";
import { useParams } from "react-router-dom";
import SearchBar from "../components/search-bar";
import ScoresList from "../components/scores-list/scores-list";
import NewScore from "../components/new-score";

export const LibraryKey = () => {
  const { libraryKey } = useParams();
  const { mutate: mutateAllScores } = useAllScores();
  const { scores, mutate: mutateLibraryScores } = useLibraryScores(libraryKey);
  const library = useLibrary(libraryKey);
  const pinned = usePinned(libraryKey, scores);

  const [newScore, setNewScore] = useState(false);
  const [toggled, setToggled] = useState<string>();

  const onToggle = (key: string) => {
    setToggled((value) => {
      return value === key ? undefined : key;
    });
  };

  return (
    <>
      <SearchBar toggled={toggled} onToggle={onToggle} />

      <div className="page">
        <ScoresList
          listKey="pinned"
          toggled={toggled}
          onToggle={onToggle}
          scores={pinned}
          title="Pinned"
        />
        <ScoresList
          listKey="list"
          toggled={toggled}
          onToggle={onToggle}
          scores={scores}
          title="Scores by title"
        />
      </div>

      {library?.write && (
        <Fab
          path={mdiPlus}
          label="Add Score"
          onClick={() => setNewScore(true)}
          primary
        />
      )}

      <NewScore
        library={libraryKey}
        open={newScore}
        onCancel={() => {
          setNewScore(false);
        }}
        onComplete={() => {
          mutateAllScores(); // triggers recaching
          mutateLibraryScores();
          setNewScore(false);
        }}
      />

      <style jsx>{`
        .page {
          padding-bottom: 96px;
        }
      `}</style>
    </>
  );
};
