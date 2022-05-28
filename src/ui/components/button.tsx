import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  type?: "button" | "reset" | "submit";
  className?: string;
  onClick: () => void;
  primary?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  outline?: boolean;
  disabled?: boolean;
  compact?: boolean;
  margin?: boolean;
  children: ReactNode;
}

const Button: FC<Props> = ({
  type = "button",
  className,
  onClick,
  children,
  primary,
  fullWidth,
  outline,
  disabled,
  compact,
  margin,
  error,
}) => {
  return (
    <>
      <button
        className={classNames(
          "ui-button",
          {
            "ui-button--primary": primary,
            "ui-button--error": error,
            "ui-button--outline": outline,
            "ui-button--full-width": fullWidth,
            "ui-button--compact": compact,
            "ui-button--margin": margin,
            "ui-button--disabled": disabled,
          },
          className
        )}
        type={type}
        onClick={onClick}
      >
        {children}
      </button>
      <style jsx>{`
        .ui-button {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius);
          text-align: center;
          padding: 0 24px;
          cursor: pointer;
          font-size: inherit;
          transition: box-shadow 0.2s;
          min-width: 110px;
          min-height: 48px;
          background-color: #fff;
          color: var(--black);
          box-shadow: var(--shadow);
        }
        .ui-button--compact {
          min-width: 0;
          min-height: 36px;
        }
        .ui-button--margin {
          margin-right: 8px;
        }
        .ui-button--full-width {
          width: 100%;
        }
        .ui-button--primary {
          background-image: linear-gradient(
            35deg,
            rgb(var(--secondary)),
            rgb(var(--primary))
          );
          color: var(--on-primary);
        }
        .ui-button--error {
          background-color: rgb(var(--error));
          color: var(--on-error);
        }
        .ui-button--outline {
          background-color: transparent;
          border: 1px solid rgb(var(--primary));
          color: rgb(var(--primary));
          box-shadow: none;
        }
        .ui-button--disabled {
          background-color: rgb(245, 245, 245);
          background-image: none;
          box-shadow: none;
          color: rgb(175, 175, 175);
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default Button;
