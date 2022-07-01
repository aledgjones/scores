import { Store } from "pullstate";
import { Library } from "./libraries";
import { Playlist } from "./playlists";
import { PlaylistScore, Score } from "./scores";

export enum Tool {
  cursor,
  pen,
  eraser,
}

interface Shape {
  drawer: boolean;
  newLibrary: { open: boolean; library?: Library };
  newPlaylist: { open: boolean; playlist?: Playlist };
  scoreSheet: { open: boolean; libraryKey?: string; score?: Score };
  playlistScoreSheet: { open: boolean; score?: PlaylistScore };
  addToPlaylist: { open: boolean; score?: Score };
  addLabel: { open: boolean; score?: PlaylistScore };
  editScore: { open: boolean; libraryKey?: string; score?: Score };
  deleteScore: { open: boolean; libraryKey?: string; score?: Score };
  deletePlaylist: { open: boolean; playlist?: Playlist };
  playlistSheet: { open: boolean; playlistKey?: string; selection?: string };
  inviteToLibrary: { open: boolean; libraryKey?: string };
  manageLibraryMember: {
    open: boolean;
    libraryKey?: string;
    uid?: string;
  };
}

export const ui = new Store<Shape>({
  drawer: false,
  newLibrary: { open: false },
  newPlaylist: { open: false },
  scoreSheet: { open: false },
  playlistScoreSheet: { open: false },
  addToPlaylist: { open: false },
  addLabel: { open: false },
  editScore: { open: false },
  deleteScore: { open: false },
  deletePlaylist: { open: false },
  playlistSheet: { open: false },
  inviteToLibrary: { open: false },
  manageLibraryMember: { open: false },
});

export const openMainDrawer = () => {
  ui.update((s) => {
    s.drawer = true;
  });
};

export const closeMainDrawer = () => {
  ui.update((s) => {
    s.drawer = false;
  });
};

export const openNewLibrary = (library?: Library) => {
  ui.update((s) => {
    s.newLibrary = { open: true, library };
  });
};

export const closeNewLibrary = () => {
  ui.update((s) => {
    s.newLibrary.open = false;
  });
};

export const openNewPlaylist = (playlist?: Playlist) => {
  ui.update((s) => {
    s.newPlaylist = { open: true, playlist };
  });
};

export const closeNewPlaylist = () => {
  ui.update((s) => {
    s.newPlaylist.open = false;
  });
};

export const openScoreSheet = (libraryKey: string, score: Score) => {
  ui.update((s) => {
    s.scoreSheet.open = true;
    s.scoreSheet.libraryKey = libraryKey;
    s.scoreSheet.score = score;
  });
};

export const closeScoreSheet = () => {
  ui.update((s) => {
    s.scoreSheet.open = false;
  });
};

export const openPlaylistScoreSheet = (score: PlaylistScore) => {
  ui.update((s) => {
    s.playlistScoreSheet.open = true;
    s.playlistScoreSheet.score = score;
  });
};

export const closePlaylistScoreSheet = () => {
  ui.update((s) => {
    s.playlistScoreSheet.open = false;
  });
};

export const openAddLabel = (score: PlaylistScore) => {
  ui.update((s) => {
    s.addLabel.open = true;
    s.addLabel.score = score;
  });
};

export const closeAddLabel = () => {
  ui.update((s) => {
    s.addLabel.open = false;
  });
};

export const openAddToPlaylist = (score: Score) => {
  ui.update((s) => {
    s.addToPlaylist.open = true;
    s.addToPlaylist.score = score;
  });
};

export const closeAddToPlaylist = () => {
  ui.update((s) => {
    s.addToPlaylist.open = false;
  });
};

export const openEditScore = (libraryKey: string, score: Score) => {
  ui.update((s) => {
    s.editScore.open = true;
    s.editScore.libraryKey = libraryKey;
    s.editScore.score = score;
  });
};

export const closeEditScore = () => {
  ui.update((s) => {
    s.editScore.open = false;
  });
};

export const openDeleteScore = (libraryKey: string, score: Score) => {
  ui.update((s) => {
    s.deleteScore.open = true;
    s.deleteScore.libraryKey = libraryKey;
    s.deleteScore.score = score;
  });
};

export const closeDeleteScore = () => {
  ui.update((s) => {
    s.deleteScore.open = false;
  });
};

export const openDeletePlaylist = (playlist: Playlist) => {
  ui.update((s) => {
    s.deletePlaylist.open = true;
    s.deletePlaylist.playlist = playlist;
  });
};

export const closeDeletePlaylist = () => {
  ui.update((s) => {
    s.deletePlaylist.open = false;
  });
};

export const openPlaylistSheet = (playlistKey: string, selection?: string) => {
  ui.update((s) => {
    s.playlistSheet.open = true;
    s.playlistSheet.playlistKey = playlistKey;
    s.playlistSheet.selection = selection;
  });
};

export const closePlaylistSheet = () => {
  ui.update((s) => {
    s.playlistSheet.open = false;
  });
};

export const openInviteToLirary = (libraryKey: string) => {
  ui.update((s) => {
    s.inviteToLibrary.open = true;
    s.inviteToLibrary.libraryKey = libraryKey;
  });
};

export const closeInviteToLibrary = () => {
  ui.update((s) => {
    s.inviteToLibrary.open = false;
  });
};

export const openManageLibraryMember = (libraryKey: string, uid: string) => {
  ui.update((s) => {
    s.manageLibraryMember.open = true;
    s.manageLibraryMember.libraryKey = libraryKey;
    s.manageLibraryMember.uid = uid;
  });
};

export const closeManageLibraryMember = () => {
  ui.update((s) => {
    s.manageLibraryMember.open = false;
  });
};
