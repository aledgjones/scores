import { mdiArrowLeft, mdiDeleteOutline, mdiPencilOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserUid } from "../services/auth";
import { openDeletePlaylist, openNewPlaylist } from "../services/ui";
import IconButton from "../ui/components/icon-button";
import Subheader from "../ui/components/subheader";
import useScrollPosition from "../ui/utils/use-scroll-position";
import Tooltip from "../ui/components/tooltip";
import classNames from "classnames";
import { usePlaylist } from "../services/playlists";
import Button from "../ui/components/button";
import Divider from "../ui/components/divider";

export const PlaylistKeySettings = () => {
  const navigate = useNavigate();
  const { playlistKey } = useParams();
  const playlist = usePlaylist(playlistKey);
  const top = useScrollPosition();
  const isOwner = playlist?.owner.uid === getUserUid();

  return (
    <>
      <div className="page">
        <div className={classNames("bar", { "bar--shadow": !top })}>
          <IconButton ariaLabel="Back to library" onClick={() => navigate(-1)}>
            <Icon path={mdiArrowLeft} size={1} />
          </IconButton>
          <h1 className="title">Playlist Settings</h1>
        </div>
        <section className="section">
          <Subheader>General</Subheader>
          <div className="item">
            <div>
              <p className="label">Playlist Name</p>
              <p>{playlist?.name}</p>
            </div>
            {playlist?.write && (
              <Tooltip text="Edit Name">
                <IconButton
                  ariaLabel="Edit name"
                  onClick={() => openNewPlaylist(playlist)}
                >
                  <Icon path={mdiPencilOutline} size={1} />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className="item">
            <div>
              <p className="label">Managed by</p>
              <p>
                {playlist?.owner.name} {isOwner && "(You)"}
              </p>
            </div>
          </div>
        </section>
        <Divider />
        <section className="section">
          <div className="actions">
            <Button compact onClick={() => openDeletePlaylist(playlist)}>
              <Icon
                path={mdiDeleteOutline}
                style={{ marginRight: 6 }}
                size={1}
              />
              Delete Playlist
            </Button>
            <p></p>
          </div>
        </section>
      </div>
      <style jsx>{`
        .page {
          padding-bottom: 96px;
        }
        .bar {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          padding: 0 28px;
          height: 88px;
          z-index: 1000;
        }
        .bar--shadow {
          background-color: #fff;
          box-shadow: var(--shadow);
        }
        .title {
          margin-left: 16px;
          font-size: 24px;
        }
        .section {
          margin-bottom: 40px;
        }
        .item {
          padding: 12px 32px 12px 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .item--disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .item.hoverable {
          cursor: pointer;
        }
        .item.hoverable:hover {
          background-color: rgb(245, 245, 245);
        }
        .label {
          font-size: 12px;
          opacity: 0.6;
        }
        .actions {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }
      `}</style>
    </>
  );
};
