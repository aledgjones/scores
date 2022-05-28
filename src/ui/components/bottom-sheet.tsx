import { createPortal } from "react-dom";
import { FC } from "react";
import Card from "./card";
import Backdrop from "./backdrop";
import classNames from "classnames";
import { delayFalse } from "../utils/delay";

interface Props {
  open: boolean;
  onClose?: () => void;
}

export function BottomSheet<T>(Content: FC<T>): FC<T & Props> {
  return ({ open, onClose, ...props }) => {
    const visible = delayFalse(open);

    if (!visible) {
      return null;
    }

    return createPortal(
      <>
        <div
          className={classNames("bottom-sheet", { "bottom-sheet--open": open })}
        >
          <Backdrop open={open} onClose={onClose} />
          <Card className="bottom-sheet-content">
            <Content
              {...(props as Omit<T & Props, "open" & "onClose">)}
              onClose={onClose}
            />
          </Card>
        </div>
        <style jsx>{`
          @keyframes bottom-sheet-in {
            0% {
              opacity: 0;
              transform: translate3d(-50%, 100%, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(-50%, 0%, 0);
            }
          }
          .bottom-sheet {
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 10000;
            height: 100vh;
            width: 100vw;
            overflow: auto;
          }
          .bottom-sheet > :global(.bottom-sheet-content) {
            position: fixed;
            bottom: 0;
            left: 50%;
            z-index: 2;
            width: 100%;
            max-width: 500px;
            opacity: 0;
            transform: translate3d(-50%, 100%, 0);
            transition: opacity 0.3s, transform 0.3s;
            border-radius: 8px 8px 0 0;
          }
          .bottom-sheet--open > :global(.bottom-sheet-content) {
            opacity: 1;
            transform: translate3d(-50%, 0%, 0);
            animation: bottom-sheet-in 0.3s;
          }
        `}</style>
      </>,
      document.body
    );
  };
}

export default BottomSheet;
