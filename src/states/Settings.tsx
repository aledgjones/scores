import { mdiArrowLeft, mdiBookmarkMultipleOutline } from "@mdi/js";
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
          <section className="section">
            <Subheader>APP UPDATE</Subheader>
            <div className="user">
              <div className="text">
                <p>An app update is availabe</p>
                <p className="small">
                  Restart the app to install the new version.
                </p>
              </div>
              <Button
                margin
                primary
                compact
                onClick={() => {
                  navigator.serviceWorker?.controller?.postMessage(
                    "SKIP_WAITING"
                  );
                }}
              >
                Restart
              </Button>
            </div>
          </section>
        )}

        {!updateAvailable && (
          <section className="section">
            <Subheader>APP UPDATE</Subheader>
            <div className="user">
              <div className="text">
                <p>Your app is up to date</p>
                <p className="small">
                  You will be notified when an update is avaialble.
                </p>
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
      `}</style>
    </>
  );
}
