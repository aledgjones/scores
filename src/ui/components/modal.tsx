import { useState } from "react";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { FC } from "react";
import Card from "./card";
import Backdrop from "./backdrop";
import classNames from "classnames";
import { delayFalse } from "../utils/delay";

interface Props {
  open: boolean;
  onClose?: () => void;
}

export function Modal<T>(Content: FC<T>): FC<T & Props> {
  return ({ open, onClose, ...props }) => {
    const [root, setRoot] = useState<HTMLElement>();

    useEffect(() => {
      setRoot(document.body);
    }, []);

    const visible = delayFalse(open);

    if (!visible || !root) {
      return null;
    }

    return createPortal(
      <>
        <div className={classNames("modal", { "modal--open": open })}>
          <Backdrop open={open} onClose={onClose} />
          <div className="wrapper">
            <Card className="modal-content">
              <Content
                {...(props as Omit<T & Props, "open" & "onClose">)}
                onClose={onClose}
              />
            </Card>
          </div>
        </div>
        <style jsx>{`
          @keyframes modal-in {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10000;
            height: 100vh;
            width: 100vw;
            overflow: auto;
          }
          .wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            min-height: 100vh;
            width: 100vw;
            z-index: 2;
          }
          .modal > .wrapper > :global(.modal-content) {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 450px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
          }
          .modal--open > .wrapper > :global(.modal-content) {
            opacity: 1;
            transform: translateY(0);
            animation: modal-in 0.3s;
          }
        `}</style>
      </>,
      root
    );
  };
}

export default Modal;
