import { usePlaylistScores } from "../services/scores";
import PlaylistList from "./playlist-list/playlist-list";
import { FC, useState } from "react";
import Drawer from "../ui/components/drawer";
import { usePlaylist } from "../services/playlists";

interface Props {
  playlistKey?: string;
  selection: string;
}

const PlaylistDrawer: FC<Props> = ({ playlistKey, selection }) => {
  const playlist = usePlaylist(playlistKey);
  const { scores } = usePlaylistScores(playlistKey);
  const [toggled, setToggled] = useState<string>(`${selection}-list`);

  return (
    <>
      <div className="head">
        <h2 className="title">{playlist?.name}</h2>
      </div>
      <div className="playlist-drawer">
        <PlaylistList
          listKey="list"
          scores={scores}
          toggled={toggled}
          onToggle={(val) =>
            setToggled((s) => {
              if (s == val) {
                return undefined;
              } else {
                return val;
              }
            })
          }
          working={false}
          inline
        />
      </div>

      <style jsx>{`
        .playlist-drawer {
          padding: 16px 0;
        }
        .head {
          display: flex;
          align-items: center;
          padding: 20px 26px 4px 26px;
        }
        .title {
          font-size: 28px;
        }
      `}</style>
    </>
  );
};

export default Drawer(PlaylistDrawer);
