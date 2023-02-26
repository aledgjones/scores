import { Store } from "pullstate";
import { useEffect } from "react";
import { Library } from "./libraries";
import { Playlist } from "./playlists";
import { PlaylistScore, Score } from "./scores";

export enum Tool {
  cursor,
  pen,
  eraser,
}

interface Shape {
  online: boolean;
  drawer: boolean;
  newLibrary: { open: boolean; library?: Library };
  newPlaylist: { open: boolean; playlist?: Playlist };
  scoreSheet: { open: boolean; libraryKey?: string; score?: Score };
  playlistScoreSheet: { open: boolean; score?: PlaylistScore };
  addToPlaylist: { open: boolean; score?: Score };
  addLabel: { open: boolean; score?: PlaylistScore };
  editScore: { open: boolean; libraryKey?: string; score?: Score };
  deleteScore: { open: boolean; libraryKey?: string; score?: Score };
  deleteLibrary: { open: boolean; library?: Library; scores?: Score[] };
  deletePlaylist: { open: boolean; playlist?: Playlist };
  playlistSheet: { open: boolean; playlistKey?: string; selection?: string };
  inviteToLibrary: { open: boolean; libraryKey?: string };
  manageLibraryMember: {
    open: boolean;
    libraryKey?: string;
    uid?: string;
  };
}

export const uiStore = new Store<Shape>({
  online: navigator.onLine,
  drawer: false,
  newLibrary: { open: false },
  newPlaylist: { open: false },
  scoreSheet: { open: false },
  playlistScoreSheet: { open: false },
  addToPlaylist: { open: false },
  addLabel: { open: false },
  editScore: { open: false },
  deleteLibrary: { open: false },
  deleteScore: { open: false },
  deletePlaylist: { open: false },
  playlistSheet: { open: false },
  inviteToLibrary: { open: false },
  manageLibraryMember: { open: false },
});

export const openMainDrawer = () => {
  uiStore.update((s) => {
    s.drawer = true;
  });
};

export const closeMainDrawer = () => {
  uiStore.update((s) => {
    s.drawer = false;
  });
};

export const openNewLibrary = (library?: Library) => {
  uiStore.update((s) => {
    s.newLibrary = { open: true, library };
  });
};

export const closeNewLibrary = () => {
  uiStore.update((s) => {
    s.newLibrary.open = false;
  });
};

export const openNewPlaylist = (playlist?: Playlist) => {
  uiStore.update((s) => {
    s.newPlaylist = { open: true, playlist };
  });
};

export const closeNewPlaylist = () => {
  uiStore.update((s) => {
    s.newPlaylist.open = false;
  });
};

export const openScoreSheet = (libraryKey: string, score: Score) => {
  uiStore.update((s) => {
    s.scoreSheet.open = true;
    s.scoreSheet.libraryKey = libraryKey;
    s.scoreSheet.score = score;
  });
};

export const closeScoreSheet = () => {
  uiStore.update((s) => {
    s.scoreSheet.open = false;
  });
};

export const openPlaylistScoreSheet = (score: PlaylistScore) => {
  uiStore.update((s) => {
    s.playlistScoreSheet.open = true;
    s.playlistScoreSheet.score = score;
  });
};

export const closePlaylistScoreSheet = () => {
  uiStore.update((s) => {
    s.playlistScoreSheet.open = false;
  });
};

export const openAddLabel = (score: PlaylistScore) => {
  uiStore.update((s) => {
    s.addLabel.open = true;
    s.addLabel.score = score;
  });
};

export const closeAddLabel = () => {
  uiStore.update((s) => {
    s.addLabel.open = false;
  });
};

export const openAddToPlaylist = (score: Score) => {
  uiStore.update((s) => {
    s.addToPlaylist.open = true;
    s.addToPlaylist.score = score;
  });
};

export const closeAddToPlaylist = () => {
  uiStore.update((s) => {
    s.addToPlaylist.open = false;
  });
};

export const openEditScore = (libraryKey: string, score: Score) => {
  uiStore.update((s) => {
    s.editScore.open = true;
    s.editScore.libraryKey = libraryKey;
    s.editScore.score = score;
  });
};

export const closeEditScore = () => {
  uiStore.update((s) => {
    s.editScore.open = false;
  });
};

export const openDeleteScore = (libraryKey: string, score: Score) => {
  uiStore.update((s) => {
    s.deleteScore.open = true;
    s.deleteScore.libraryKey = libraryKey;
    s.deleteScore.score = score;
  });
};

export const closeDeleteScore = () => {
  uiStore.update((s) => {
    s.deleteScore.open = false;
  });
};

export const openDeleteLibrary = (library: Library, scores: Score[]) => {
  uiStore.update((s) => {
    s.deleteLibrary.open = true;
    s.deleteLibrary.library = library;
    s.deleteLibrary.scores = scores;
  });
};

export const closeDeleteLibrary = () => {
  uiStore.update((s) => {
    s.deleteLibrary.open = false;
  });
};

export const openDeletePlaylist = (playlist: Playlist) => {
  uiStore.update((s) => {
    s.deletePlaylist.open = true;
    s.deletePlaylist.playlist = playlist;
  });
};

export const closeDeletePlaylist = () => {
  uiStore.update((s) => {
    s.deletePlaylist.open = false;
  });
};

export const openPlaylistSheet = (playlistKey: string, selection?: string) => {
  uiStore.update((s) => {
    s.playlistSheet.open = true;
    s.playlistSheet.playlistKey = playlistKey;
    s.playlistSheet.selection = selection;
  });
};

export const closePlaylistSheet = () => {
  uiStore.update((s) => {
    s.playlistSheet.open = false;
  });
};

export const openInviteToLirary = (libraryKey: string) => {
  uiStore.update((s) => {
    s.inviteToLibrary.open = true;
    s.inviteToLibrary.libraryKey = libraryKey;
  });
};

export const closeInviteToLibrary = () => {
  uiStore.update((s) => {
    s.inviteToLibrary.open = false;
  });
};

export const openManageLibraryMember = (libraryKey: string, uid: string) => {
  uiStore.update((s) => {
    s.manageLibraryMember.open = true;
    s.manageLibraryMember.libraryKey = libraryKey;
    s.manageLibraryMember.uid = uid;
  });
};

export const closeManageLibraryMember = () => {
  uiStore.update((s) => {
    s.manageLibraryMember.open = false;
  });
};

export const useConnectionWorker = () => {
  useEffect(() => {
    const online = () => {
      uiStore.update((s) => {
        s.online = true;
      });
    };
    const offline = () => {
      uiStore.update((s) => {
        s.online = false;
      });
    };

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);
};
