import { FC, useState } from "react";
import classNames from "classnames";
import IconButton from "./icon-button";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

interface Props {
  type: "text" | "email" | "password";
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  margin?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  onEnter?: () => void;
  autoFocus?: boolean;
  clearable?: boolean;
}

const Input: FC<Props> = ({
  type,
  label,
  value,
  onChange,
  className,
  margin,
  autoComplete,
  disabled,
  onEnter,
  autoFocus,
  clearable,
}) => {
  const [focus, setFocus] = useState(false);
  const canClear = !disabled && clearable && value;

  const handleEnter = (e) => {
    if (onEnter && e.key === "Enter") {
      onEnter();
    }
  };

  return (
    <>
      <div
        className={classNames(
          "ui-input",
          {
            "ui-input--margin": margin,
            "ui-input--focus": focus,
            "ui-input--float": value || focus,
            "ui-input--disabled": disabled,
            "ui-input--clearable": clearable,
          },
          className
        )}
      >
        <p className="label">{label}</p>
        <input
          type={type}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          onKeyPress={handleEnter}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        {canClear && (
          <IconButton
            className="clear"
            ariaLabel="clear"
            onClick={() => onChange("")}
          >
            <Icon path={mdiClose} size={1} />
          </IconButton>
        )}
      </div>
      <style jsx>{`
        .ui-input {
          position: relative;
          width: 100%;
          z-index: 1;
        }
        .ui-input--margin {
          margin-bottom: 20px;
        }
        .input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 8px;
          color: var(--black);
          border: 1px solid rgb(200, 200, 200);
          transition: border 0.15s;
        }
        .ui-input--focus .input {
          border: 1px solid rgb(var(--primary));
        }
        .label {
          color: rgb(150, 150, 150);
          position: absolute;
          top: 13px;
          left: 12px;
          pointer-events: none;
          transition: top 0.15s, font-size 0.15s, color 0.15s;
          padding: 0 4px;
          background-color: #fff;
        }
        .ui-input--float .label {
          font-size: 10px;
          top: -6px;
        }
        .ui-input--focus .label {
          color: rgb(var(--primary));
        }
        .ui-input--clearable .input {
          padding-right: 48px;
        }
        .ui-input :global(.clear) {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        .ui-input--disabled {
          pointer-events: none;
        }
        .ui-input--disabled .input {
          border: 1px dashed rgb(200, 200, 200);
          background-color: transparent;
        }
      `}</style>
    </>
  );
};

export default Input;
