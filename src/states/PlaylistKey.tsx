import { useState } from "react";
import { arrayMoveImmutable as arrayMove } from "array-move";
import { useParams } from "react-router-dom";
import { reorderPlaylist, usePlaylist } from "../services/playlists";
import { usePlaylistScores } from "../services/scores";
import SearchBar from "../components/search-bar";
import PlaylistList from "../components/playlist-list/playlist-list";

export function PlaylistKey() {
  const { playlistKey } = useParams();
  const playlist = usePlaylist(playlistKey);
  const { scores, mutate } = usePlaylistScores(playlistKey);
  const [toggled, setToggled] = useState<string>();
  const [working, setWorking] = useState(false);

  const onToggle = (key: string) => {
    setToggled((value) => {
      return value === key ? undefined : key;
    });
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const data = arrayMove(scores, oldIndex, newIndex);
      mutate(data, false);
      setWorking(true);
      await reorderPlaylist(playlistKey, data);
      setWorking(false);
      mutate();
    }
  };

  return (
    <>
      <SearchBar toggled={toggled} onToggle={onToggle} />
      <div className="page">
        <PlaylistList
          lockAxis="y"
          transitionDuration={200}
          useDragHandle
          helperClass="ghost"
          onSortEnd={onSortEnd}
          listKey="list"
          toggled={toggled}
          onToggle={onToggle}
          scores={scores}
          title={playlist?.name}
          working={working}
        />
      </div>
      <style jsx>{`
        .page {
          padding-bottom: 96px;
        }
      `}</style>
    </>
  );
}
