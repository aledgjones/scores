import classNames from "classnames";
import { FC } from "react";

interface Props {
  open: boolean;
  onClose?: () => void;
}

const Backdrop: FC<Props> = ({ open, onClose }) => {
  return (
    <>
      <div
        className={classNames("backdrop-scrim", {
          "backdrop-scrim--show": open,
        })}
        onPointerDown={onClose}
      />
      <style jsx>{`
        @keyframes backdrop-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .backdrop-scrim {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1;
          transition: opacity 0.3s;
          opacity: 0;
          pointer-events: none;
        }
        .backdrop-scrim--show {
          opacity: 1;
          pointer-events: all;
          animation: backdrop-in 0.3s;
        }
      `}</style>
    </>
  );
};

export default Backdrop;
