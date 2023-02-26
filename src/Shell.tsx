import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import AddLabel from "./components/add-label";
import AddToPlaylist from "./components/add-to-playlist";
import DeleteLibrary from "./components/delete-library";
import DeletePlaylist from "./components/delete-playlist";
import DeleteScore from "./components/delete-score";
import InviteToLibrary from "./components/invite-to-library";
import MainDrawer from "./components/main-drawer";
import ManageLibraryMember from "./components/manage-library-member";
import NewLibrary from "./components/new-library";
import NewPlaylist from "./components/new-playlist";
import PlaylistDrawer from "./components/playlist-drawer";
import PlaylistScoreSheet from "./components/playlist-score-sheet";
import ScoreSheet from "./components/score-sheet";
import { useAuth, useAuthListener } from "./services/auth";
import { useCacheWorker } from "./services/cache";
import { useCleanupWorker } from "./services/cleanup";
import { useLibraries } from "./services/libraries";
import { usePlaylists } from "./services/playlists";
import {
  closeAddLabel,
  closeAddToPlaylist,
  closeDeleteLibrary,
  closeDeletePlaylist,
  closeDeleteScore,
  closeInviteToLibrary,
  closeMainDrawer,
  closeManageLibraryMember,
  closeNewLibrary,
  closeNewPlaylist,
  closePlaylistScoreSheet,
  closePlaylistSheet,
  closeScoreSheet,
  uiStore,
  useConnectionWorker,
} from "./services/ui";
import { useWakeLock } from "./ui/utils/wake-lock";

export const Shell = () => {
  const navigate = useNavigate();

  useWakeLock();
  useAuthListener();
  useLibraries();
  usePlaylists();
  useCacheWorker();
  useCleanupWorker();
  useConnectionWorker();

  const auth = useAuth();

  useEffect(() => {
    if (auth === undefined) {
      navigate("/");
    }
  }, [auth]);

  const {
    newLibrary,
    newPlaylist,
    scoreSheet,
    playlistScoreSheet,
    addLabel,
    addToPlaylist,
    deleteScore,
    deleteLibrary,
    deletePlaylist,
    playlistSheet,
    inviteToLibrary,
    manageLibraryMember,
    drawer,
  } = uiStore.useState((s) => s);

  return (
    <>
      <Outlet />

      <Toaster
        position="bottom-center"
        containerStyle={{ zIndex: 200000, top: 20 }}
        toastOptions={{
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#fff",
              secondary: "rgb(var(--error))",
            },
            style: {
              boxShadow: "var(--shadow-hover)",
              color: "#fff",
              backgroundColor: "rgb(var(--error))",
              padding: "10px 16px",
              maxWidth: 450,
            },
          },
        }}
      />

      <MainDrawer position="left" open={drawer} onClose={closeMainDrawer} />

      <NewLibrary
        open={newLibrary.open}
        library={newLibrary.library}
        onClose={closeNewLibrary}
      />

      <NewPlaylist
        open={newPlaylist.open}
        playlist={newPlaylist.playlist}
        onClose={closeNewPlaylist}
      />

      <PlaylistScoreSheet
        open={playlistScoreSheet.open}
        score={playlistScoreSheet.score}
        onClose={closePlaylistScoreSheet}
      />

      <ScoreSheet
        open={scoreSheet.open}
        libraryKey={scoreSheet.libraryKey}
        score={scoreSheet.score}
        onClose={closeScoreSheet}
      />

      <AddToPlaylist
        open={addToPlaylist.open}
        score={addToPlaylist.score}
        onClose={closeAddToPlaylist}
      />

      <AddLabel
        open={addLabel.open}
        score={addLabel.score}
        onClose={closeAddLabel}
      />

      <DeleteScore
        open={deleteScore.open}
        libraryKey={deleteScore.libraryKey}
        score={deleteScore.score}
        onClose={closeDeleteScore}
      />

      <DeleteLibrary
        open={deleteLibrary.open}
        library={deleteLibrary.library}
        scores={deleteLibrary.scores}
        onClose={closeDeleteLibrary}
      />

      <DeletePlaylist
        open={deletePlaylist.open}
        playlist={deletePlaylist.playlist}
        onClose={closeDeletePlaylist}
      />

      <InviteToLibrary
        open={inviteToLibrary.open}
        libraryKey={inviteToLibrary.libraryKey}
        onClose={closeInviteToLibrary}
      />

      <ManageLibraryMember
        open={manageLibraryMember.open}
        libraryKey={manageLibraryMember.libraryKey}
        uid={manageLibraryMember.uid}
        onClose={closeManageLibraryMember}
      />

      <PlaylistDrawer
        wide
        position="right"
        open={playlistSheet.open}
        playlistKey={playlistSheet.playlistKey}
        selection={playlistSheet.selection}
        onClose={closePlaylistSheet}
      />
    </>
  );
};
