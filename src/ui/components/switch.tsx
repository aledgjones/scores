import classNames from "classnames";
import { FC } from "react";

interface Props {
  className?: string;
  value: boolean;
  disabled?: boolean;
}

const Switch: FC<Props> = ({ className, value, disabled }) => {
  return (
    <>
      <div
        className={classNames(
          "ui-switch",
          { "ui-switch--active": value, "ui-switch--disabled": disabled },
          className
        )}
      >
        <div className="track" />
        <div className="button" />
      </div>
      <style jsx>{`
        .ui-switch {
          display: flex;
          position: relative;
          justify-content: flex-start;
          align-items: center;
          height: 14px;
        }

        .track {
          position: relative;
          display: block;
          height: 14px;
          width: 36px;
          min-width: 36px;
          border-radius: 7px;
          background-color: #ccc;
          transition: background-color 0.2s, opacity 0.2s;
        }

        .button {
          position: absolute;
          top: -3px;
          left: -3px;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transition: background-color 0.2s, left 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          background-color: #fff;
        }

        .ui-switch--active .track {
          background-color: rgb(var(--primary));
          opacity: 0.6;
        }

        .ui-switch--active .button {
          background-color: rgb(var(--primary));
          left: 19px;
        }

        .ui-switch--disabled {
          pointer-events: none;
        }

        .ui-switch--disabled .track {
          background-color: rgba(0, 0, 0, 0.12) !important;
        }

        .ui-switch--disabled .button {
          background-color: #bdbdbd !important;
        }
      `}</style>
    </>
  );
};

export default Switch;
