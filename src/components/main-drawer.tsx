import Icon from "@mdi/react";
import {
  setLastLibrary,
  useLibraries,
  useUserLibraryInvites,
} from "../services/libraries";
import Drawer from "../ui/components/drawer";
import IconButton from "../ui/components/icon-button";
import pkg from "../../package.json";
import {
  mdiBellRingOutline,
  mdiBookmarkMultipleOutline,
  mdiCogOutline,
  mdiDownload,
  mdiInformationOutline,
  mdiLogout,
  mdiPlaylistMusicOutline,
  mdiPlus,
} from "@mdi/js";
import classNames from "classnames";
import { FC } from "react";
import { usePlaylists } from "../services/playlists";
import {
  closeMainDrawer,
  openNewLibrary,
  openNewPlaylist,
  uiStore,
} from "../services/ui";
import { signOut } from "../services/auth";
import { pluralize } from "../ui/utils/pluralize";
import Tag from "../ui/components/tag";
import { wait } from "../ui/utils/wait";
import { Link, useNavigate, useParams } from "react-router-dom";

const MainDrawer: FC = () => {
  const navigate = useNavigate();
  const { libraryKey, playlistKey } = useParams();

  const { libraries } = useLibraries();
  const { playlists } = usePlaylists();
  const { invites } = useUserLibraryInvites();

  const updateAvailable = uiStore.useState((s) => s.updateAvailable);

  const onSignOut = async () => {
    closeMainDrawer();
    await wait();
    await signOut();
    navigate("/");
  };

  return (
    <>
      <div className="logo">
        <img
          alt="Solo Scores logo"
          src="/solo.png"
          height={64}
          width={64}
          loading="lazy"
        />
        <h1 className="logo-text">{pkg.displayName}</h1>
        <p className="logo-version">Version {pkg.version}</p>
      </div>

      <ul>
        <li className="item">
          <Icon
            className="icon"
            color="rgb(var(--primary))"
            path={mdiBookmarkMultipleOutline}
            size={1}
          />
          <h2 className="heading">Libraries</h2>
          <IconButton
            ariaLabel="Create Library"
            onClick={() => {
              openNewLibrary();
              closeMainDrawer();
            }}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </li>
        {libraries.map((item) => {
          return (
            <Link
              key={item.key}
              to={`/library/${item.key}`}
              onClick={() => setLastLibrary(item.key)}
            >
              <li
                className={classNames("item hover pad", {
                  selected: item.key === libraryKey,
                })}
                onClick={closeMainDrawer}
              >
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>
      <ul>
        <li className="item">
          <Icon
            className="icon"
            color="rgb(var(--primary))"
            path={mdiPlaylistMusicOutline}
            size={1}
          />
          <h2 className="heading">Playlists</h2>
          <IconButton
            ariaLabel="Create Playlist"
            onClick={() => {
              openNewPlaylist();
              closeMainDrawer();
            }}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </li>
        {playlists.map((item) => {
          return (
            <Link key={item.key} to={`/playlist/${item.key}`}>
              <li
                className={classNames("item hover pad", {
                  selected: item.key === playlistKey,
                })}
                onClick={closeMainDrawer}
              >
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>

      <ul>
        <Link to={`/settings`}>
          <li className="item hover" onClick={closeMainDrawer}>
            <Icon
              className="icon"
              path={mdiCogOutline}
              size={1}
              color="rgb(100,100,100)"
            />
            <h2 className="space">App Settings</h2>
            {invites.length > 0 && (
              <Tag path={mdiBellRingOutline}>
                New {pluralize(invites.length, "invite", "invites")}
              </Tag>
            )}
            {updateAvailable && <Tag path={mdiDownload}>App update</Tag>}
          </li>
        </Link>
        <Link to={`/help-and-feedback`}>
          <li className="item hover">
            <Icon
              className="icon"
              path={mdiInformationOutline}
              size={1}
              color="rgb(100,100,100)"
            />
            <h2>Help &amp; Feedback</h2>
          </li>
        </Link>
        <li className="item hover" onClick={onSignOut}>
          <Icon
            className="icon"
            path={mdiLogout}
            size={1}
            color="rgb(100,100,100)"
          />
          <h2>Sign out</h2>
        </li>
      </ul>

      <style jsx>{`
        .logo {
          text-align: center;
          padding: 20px;
          border-bottom: 1px solid rgb(235, 235, 235);
        }
        .logo img {
          margin: 0 auto;
        }
        .logo-text {
          font-size: 24px;
        }
        .logo-version {
          opacity: 0.5;
          font-size: 12px;
        }
        .item {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 48px;
        }
        .item.pad {
          padding-left: 56px;
        }
        .item.hover {
          cursor: pointer;
        }
        .item.hover:hover {
          background-color: rgb(245, 245, 245);
        }
        .selected {
          color: rgb(var(--primary));
        }
        .item :global(.icon) {
          margin-right: 16px;
        }
        .heading {
          flex-grow: 1;
          font-weight: bold;
        }
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          border-bottom: 1px solid rgb(235, 235, 235);
          padding: 8px 0;
        }
        ul:last-child {
          border-bottom: none;
        }
        .new-library {
          padding: 20px;
          border-top: 1px solid rgb(235, 235, 235);
          border-bottom: 1px solid rgb(235, 235, 235);
          margin-bottom: 8px;
        }
        .space {
          margin-right: auto;
        }
      `}</style>
    </>
  );
};

export default Drawer(MainDrawer);
