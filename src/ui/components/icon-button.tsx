import classNames from "classnames";
import { FC, MouseEvent, ReactNode } from "react";

interface Props {
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel: string;
  margin?: boolean;
  children: ReactNode;
}

const IconButton: FC<Props> = ({
  children,
  className,
  onClick,
  disabled,
  ariaLabel,
  margin,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "icon-button",
          { "icon-button--disabled": disabled, "icon-button--margin": margin },
          className
        )}
        aria-label={ariaLabel}
      >
        <div className="target" />
        {children}
      </button>
      <style jsx>{`
        .icon-button {
          position: relative;
          padding: 4px;
          cursor: pointer;
          border-radius: 50%;
        }
        .icon-button:hover,
        .icon-button:active {
          background-color: rgb(245, 245, 245);
        }
        .target {
          position: absolute;
          left: -8px;
          top: -8px;
          width: calc(100% + 16px);
          height: calc(100% + 16px);
        }
        .icon-button--margin {
          margin-right: 12px;
        }
        .icon-button--disabled {
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>
    </>
  );
};

export default IconButton;
