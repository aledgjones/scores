import { FC } from "react";
import classNames from "classnames";
import Icon from "@mdi/react";
import useScrollPosition from "../utils/use-scroll-position";

interface Props {
  path: string;
  label: string;
  className?: string;
  onClick: () => void;
  primary?: boolean;
  fullWidth?: boolean;
  outline?: boolean;
}

const Fab: FC<Props> = ({ path, label, className, onClick, primary }) => {
  const top = useScrollPosition();
  return (
    <>
      <button
        className={classNames(
          "ui-fab",
          {
            "ui-fab--primary": primary,
            "ui-fab--compact": !top,
          },
          className
        )}
        type="button"
        onClick={onClick}
      >
        <Icon path={path} size={1} />
        <p className="label">{label}</p>
      </button>
      <style jsx>{`
        .ui-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 28px;
          text-align: center;
          padding: 0 16px;
          cursor: pointer;
          font-size: inherit;
          transition: box-shadow 0.2s;
          min-height: 56px;
          background-color: #fff;
          color: var(--black);
          box-shadow: var(--shadow);
          overflow: hidden;
          z-index: 10000;
        }
        .ui-fab--primary {
          background-image: linear-gradient(
            35deg,
            rgb(var(--secondary)),
            rgb(var(--primary))
          );
          color: var(--on-primary);
        }
        .label {
          white-space: nowrap;
          margin-left: 12px;
          transition: width 0.3s, margin-left 0.3s, opacity 0.2s 0.1s;
          width: 76px;
          opacity: 1;
        }
        .ui-fab--compact .label {
          width: 0;
          margin-left: 0;
          opacity: 0;
          transition: width 0.3s, margin-left 0.3s, opacity 0.1s;
        }
      `}</style>
    </>
  );
};

export default Fab;
