import {
  mdiArrowLeft,
  mdiBookmarkMultipleOutline,
  mdiDownloadCircle,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  acceptLibraryInvite,
  rejectLibraryInvite,
  useUserLibraryInvites,
} from "../services/libraries";
import Avatar from "../ui/components/avatar";
import Button from "../ui/components/button";
import IconButton from "../ui/components/icon-button";
import Subheader from "../ui/components/subheader";
import { stringToColor } from "../ui/utils/string-to-color";
import useScrollPosition from "../ui/utils/use-scroll-position";
import pkg from "../../package.json";
import { uiStore } from "../services/ui";

export function Settings() {
  const navigate = useNavigate();
  const { invites, mutate } = useUserLibraryInvites();
  const top = useScrollPosition();

  const updateAvailable = uiStore.useState((s) => s.updateAvailable);

  return (
    <>
      <div className="page">
        <div className={classNames("bar", { "bar--shadow": !top })}>
          <IconButton ariaLabel="Back to library" onClick={() => navigate(-1)}>
            <Icon path={mdiArrowLeft} size={1} />
          </IconButton>
          <h1 className="title">App Settings</h1>
        </div>

        {updateAvailable && (
          <section className="update-bullet">
            <div className="update">
              <div className="update-text">
                <Icon
                  style={{ marginRight: 12 }}
                  className="icon"
                  path={mdiDownloadCircle}
                  size={1}
                  color="#fff"
                />
                <div className="text">
                  <p>An app update is availabe</p>
                  <p className="small">
                    Restart the app to install the new version.
                  </p>
                </div>
              </div>
              <div className="button">
                <Button
                  margin
                  compact
                  onClick={async () => {
                    const reg = await navigator.serviceWorker.getRegistration();
                    if (reg.waiting) {
                      reg.waiting.postMessage("SKIP_WAITING");
                    }
                  }}
                >
                  Restart
                </Button>
              </div>
            </div>
          </section>
        )}

        {invites.length > 0 && (
          <section className="section">
            <Subheader>Library invites</Subheader>
            {invites.map(({ key, libraryKey, name, owner }) => {
              const color = stringToColor(name);
              return (
                <div className="user" key={key}>
                  <Avatar color={color} margin>
                    <Icon path={mdiBookmarkMultipleOutline} size={1} />
                  </Avatar>
                  <div className="text">
                    <p>{name}</p>
                    <p className="small">Request from {owner}</p>
                  </div>
                  <Button
                    margin
                    primary
                    compact
                    onClick={async () => {
                      try {
                        await acceptLibraryInvite(libraryKey);
                        toast.success("Library added");
                        mutate();
                      } catch (e) {
                        toast.error(e.message);
                      }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    compact
                    onClick={async () => {
                      try {
                        await rejectLibraryInvite(libraryKey);
                        mutate();
                      } catch (e) {
                        toast.error(e.message);
                      }
                    }}
                  >
                    Reject
                  </Button>
                </div>
              );
            })}
          </section>
        )}

        <section className="section">
          <Subheader>Version Info</Subheader>
          <div className="info">
            <p>
              {pkg.displayName} {pkg.version}
            </p>
            <p>Rendering Engine {pkg.dependencies.react.replace("^", "")}</p>
            <p>PDF Engine {pkg.dependencies["pdfjs-dist"].replace("^", "")}</p>
            <br />
            <p>
              &copy; {pkg.author} {new Date().getFullYear()}
            </p>
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
        .user {
          display: flex;
          align-items: center;
          padding: 12px 32px 12px 35px;
        }
        .user.hover {
          cursor: pointer;
        }
        .text {
          flex-grow: 1;
        }
        .small {
          font-size: 0.8em;
          opacity: 0.6;
        }
        .info {
          padding: 12px 32px 12px 35px;
        }
        .update-bullet {
          padding: 32px;
          padding-top: 0;
          padding-bottom: 20px;
        }
        .update {
          border-radius: 8px;
          background-color: rgb(var(--primary));
          padding: 20px;
          color: #fff;
        }
        .update-text {
          display: flex;
          align-items: center;
        }
        .button {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
}
