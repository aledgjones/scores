import {
  mdiArrowLeft,
  mdiClose,
  mdiDeleteOutline,
  mdiDotsVertical,
  mdiPencilOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  openDeletePlaylist,
  openInviteToPlaylist,
  openManagePlaylistMember,
  openNewPlaylist,
} from "../services/ui";
import IconButton from "../ui/components/icon-button";
import Subheader from "../ui/components/subheader";
import useScrollPosition from "../ui/utils/use-scroll-position";
import Tooltip from "../ui/components/tooltip";
import classNames from "classnames";
import {
  revokePlaylistInvite,
  usePlaylist,
  usePlaylistInvites,
  usePlaylistMembers,
} from "../services/playlists";
import Button from "../ui/components/button";
import Divider from "../ui/components/divider";
import { useUserId } from "../services/auth";
import { stringToColor } from "../ui/utils/string-to-color";
import Avatar from "../ui/components/avatar";
import { toast } from "react-hot-toast";

export const PlaylistKeySettings = () => {
  const navigate = useNavigate();
  const uid = useUserId();
  const { playlistKey } = useParams();
  const { members } = usePlaylistMembers(playlistKey);
  const { invites, mutate } = usePlaylistInvites(playlistKey);
  const playlist = usePlaylist(playlistKey);
  const top = useScrollPosition();
  const isOwner = playlist?.owner.uid === uid;
  const canManage = isOwner;

  const revokeInvite = async (email: string) => {
    try {
      await revokePlaylistInvite(playlistKey, email);
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
  };

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
        <section className="section">
          <Subheader>Members ({members.length})</Subheader>
          {members.map((user) => {
            const isUserOwner = playlist?.owner?.uid === user.uid;
            const initial = user.name.slice(0, 1).toLocaleUpperCase();
            const color = stringToColor(user.email);
            return (
              <div className="user" key={user.uid}>
                <Avatar color={color} margin image={user.avatar}>
                  {initial}
                </Avatar>
                <div className="text">
                  <p>
                    {user.name} {isUserOwner ? "(Owner)" : ""}
                  </p>
                  <p className="small">{user.email}</p>
                </div>
                {!isUserOwner && canManage && (
                  <Tooltip text="User options">
                    <IconButton
                      ariaLabel="User options"
                      onClick={() =>
                        openManagePlaylistMember(playlistKey, user.uid)
                      }
                    >
                      <Icon path={mdiDotsVertical} size={1} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </section>
        {canManage && (
          <section className="section">
            <Subheader>Pending invites ({invites.length})</Subheader>
            {invites.map((email) => {
              const initial = email.slice(0, 1).toLocaleUpperCase();
              const color = stringToColor(email);
              return (
                <div className="user" key={email}>
                  <Avatar color={color} margin>
                    {initial}
                  </Avatar>
                  <div className="text">
                    <p>{email}</p>
                    <p className="small">Awaiting response</p>
                  </div>
                  <Tooltip text="Revoke">
                    <IconButton
                      ariaLabel="revoke invite"
                      onClick={() => revokeInvite(email)}
                    >
                      <Icon path={mdiClose} size={1} />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <div
              className="user hover"
              onClick={() => openInviteToPlaylist(playlistKey)}
            >
              <Avatar color="#aaa" margin>
                +
              </Avatar>
              <div className="text">
                <p>Send invite</p>
                <p className="small">
                  Invite a new user using their email address
                </p>
              </div>
            </div>
          </section>
        )}
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
        .user {
          display: flex;
          align-items: center;
          padding: 12px 32px 12px 35px;
        }
        .user.hover {
          cursor: pointer;
        }
        .user.hover:hover {
          background-color: rgb(245, 245, 245);
        }
        .text {
          flex-grow: 1;
        }
        .small {
          font-size: 0.8em;
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
