import { Routes, Route } from "react-router-dom";
import { Shell } from "./Shell";
import { AuthCheck } from "./states/AuthCheck";
import { Library } from "./states/library";
import { LibraryKey } from "./states/LibraryKey";
import { LibraryKeySettings } from "./states/LibraryKeySettings";
import { Login } from "./states/Login";
import { NotFound } from "./states/NotFound";
import PlaylistKey from "./states/PlaylistKey";
import { PlaylistKeyScore } from "./states/PlaylistKeyScore";
import { ScorePage } from "./states/ScorePage";
import { Signup } from "./states/Signup";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthCheck />} />
        <Route path="/" element={<Shell />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/library" element={<Library />} />
          <Route path="/library/:libraryKey" element={<LibraryKey />} />
          <Route
            path="/library/:libraryKey/settings"
            element={<LibraryKeySettings />}
          />

          <Route path="/score/:scoreKey/:partKey" element={<ScorePage />} />

          <Route path="/playlist/:playlistKey" element={<PlaylistKey />} />
          <Route
            path="/playlist/:playlistKey/:playlistScoreKey/:scoreKey/:partKey"
            element={<PlaylistKeyScore />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
