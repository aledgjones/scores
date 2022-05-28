import { createPortal } from "react-dom";
import { FC } from "react";
import Backdrop from "./backdrop";
import classNames from "classnames";
import { delayFalse, delayTrue } from "../utils/delay";

interface Props {
  wide?: boolean;
  position: "left" | "right";
  open: boolean;
  onClose?: () => void;
}

export function Drawer<T>(Content: FC<T>): FC<T & Props> {
  return ({ position, wide, open, onClose, ...props }) => {
    const visible = delayFalse(open);
    const active = delayTrue(open);

    if (!visible) {
      return null;
    }

    return createPortal(
      <>
        <div
          className={classNames("drawer", `drawer--${position}`, {
            "drawer--open": open,
            "drawer--wide": wide,
            "drawer--active": active,
          })}
        >
          <Backdrop open={open} onClose={onClose} />
          <div className="drawer-content">
            <Content
              {...(props as Omit<
                T & Props,
                "position" & "width" & "open" & "onClose"
              >)}
              onClose={onClose}
            />
          </div>
        </div>
        <style jsx>{`
          @keyframes drawer-in--left {
            0% {
              opacity: 0;
              transform: translate3d(-100%, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes drawer-in--right {
            0% {
              opacity: 0;
              transform: translate3d(100%, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          .drawer {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10001;
            height: 100vh;
            width: 100vw;
            overflow: auto;
          }
          .drawer > :global(.drawer-content) {
            position: fixed;
            top: 0;
            z-index: 2;
            width: calc(100% - 48px);
            max-width: 320px;
            height: 100vh;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
              0 1px 2px rgba(0, 0, 0, 0.24);
            background-color: #fff;
            overflow: auto;
            pointer-events: none;
          }
          .drawer--active > :global(.drawer-content) {
            pointer-events: all;
          }
          .drawer--wide > :global(.drawer-content) {
            max-width: 520px;
          }
          .drawer--left > :global(.drawer-content) {
            left: 0;
            transform: translate3d(-100%, 0, 0);
          }
          .drawer--right > :global(.drawer-content) {
            right: 0;
            transform: translate3d(100%, 0, 0);
          }
          .drawer--open > :global(.drawer-content) {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          .drawer--open.drawer--left > :global(.drawer-content) {
            animation: drawer-in--left 0.3s;
          }
          .drawer--open.drawer--right > :global(.drawer-content) {
            animation: drawer-in--right 0.3s;
          }
        `}</style>
      </>,
      document.body
    );
  };
}

export default Drawer;
