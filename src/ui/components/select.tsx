import { Children, FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import Card from "./card";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { useRef } from "react";
import { cloneElement } from "react";

interface Props {
  label: string;
  value: any;
  onChange: (value: any) => void;
  className?: string;
  margin?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

const Select: FC<Props> = ({
  label,
  value,
  onChange,
  className,
  margin,
  children,
  disabled,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const cb = (e: any) => {
      if (focus && ref.current && !ref.current.contains(e.target)) {
        setFocus(false);
      }
    };
    document.addEventListener("click", cb);
    return () => {
      document.removeEventListener("click", cb);
    };
  });

  let display = "";
  Children.forEach(children, (child: any) => {
    if (child.props.value === value) {
      display = child.props.children;
    }
  });

  return (
    <>
      <div
        ref={ref}
        className={classNames(
          "ui-input",
          {
            "ui-input--margin": margin,
            "ui-input--focus": focus,
            "ui-input--float": value !== null,
            "ui-input--disabled": disabled,
          },
          className
        )}
      >
        <p className="label">{label}</p>
        <button
          disabled={disabled}
          onClick={() => setFocus((f) => !f)}
          className="input"
        >
          {display}
          <Icon
            className="chevron"
            path={focus ? mdiChevronUp : mdiChevronDown}
            size={1}
            color="rgb(150,150,150)"
          />
        </button>
        <Card className={classNames("options", { "options--focus": focus })}>
          <ul>
            {Children.map(children, (child: any) => {
              return cloneElement(child, {
                onChange: (value: any) => {
                  onChange(value);
                  setFocus(false);
                },
              });
            })}
          </ul>
        </Card>
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
          height: 48px;
          padding: 13px 16px;
          border-radius: 8px;
          color: var(--black);
          border: 1px solid rgb(200, 200, 200);
          transition: border 0.15s;
          cursor: pointer;
          font-size: 16px;
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
        .ui-input :global(.chevron) {
          position: absolute;
          right: 16px;
          top: 12px;
          pointer-events: none;
        }
        .ui-input :global(.options) {
          position: absolute;
          left: 0;
          top: 100%;
          width: 100%;
          max-height: 163.75px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          overflow: auto;
        }
        .ui-input :global(.options--focus) {
          opacity: 1;
          pointer-events: all;
        }
        ul {
          padding: 8px 0;
          margin: 0;
        }
        .ui-input--disabled {
          pointer-events: none;
        }
        .ui-input--disabled .input {
          border: 1px dashed rgb(200, 200, 200);
        }
      `}</style>
    </>
  );
};

export default Select;
