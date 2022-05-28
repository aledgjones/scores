import React, { FC } from "react";
import Big from "big.js";
import classNames from "classnames";

interface Props {
  className?: string;
  size?: number;
  color?: string;
  max?: number;
  value?: number;
}

const Spinner: FC<Props> = ({
  className,
  size = 24,
  color = "currentColor",
  max,
  value,
}) => {
  let dashoffset: string;
  let dasharray: number;
  if (max !== undefined && value !== undefined && max > 0) {
    const c = 125.66; // circumference @ r=20;
    const _value = new Big(value).div(max).times(c);
    dashoffset = `${new Big(c).minus(_value).toFixed(2)}`;
    dasharray = c;
  }

  const animate = max === undefined && value === undefined;

  return (
    <>
      <svg
        className={classNames(
          "ui-spinner",
          { "ui-spinner--animate": animate },
          className
        )}
        viewBox="25 25 50 50"
      >
        <circle className="circle" cx="50" cy="50" r="20" />
      </svg>
      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotateZ(-90deg);
          }
          100% {
            transform: rotateZ(270deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 5, 120.66;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100, 25.66;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 5, 120.66;
            stroke-dashoffset: -125.66;
          }
        }

        .ui-spinner {
          position: relative;
          transform: rotateZ(-90deg);
          height: ${size}px;
          width: ${size}px;
        }

        .circle {
          transform-origin: 50% 50%;
          stroke-linecap: round;
          stroke-width: 4px;
          fill: none;
          stroke: ${color};
          stroke-dasharray: ${dasharray};
          stroke-dashoffset: ${dashoffset};
          transition: stroke-dasharray 0.2s, stroke-dashoffset 0.2s,
            transform 0.2s;
        }

        .ui-spinner--animate {
          animation: rotate 1.5s linear infinite;
        }

        .ui-spinner--animate .circle {
          animation: dash 1.5s infinite;
          transition: none;
        }
      `}</style>
    </>
  );
};

export default Spinner;
