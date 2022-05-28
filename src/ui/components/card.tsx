import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  margin?: boolean;
  children: ReactNode;
}

const Card: FC<Props> = ({ children, margin, className }) => {
  return (
    <>
      <div
        className={classNames(
          "ui-card",
          {
            "ui-button--margin": margin,
          },
          className
        )}
      >
        {children}
      </div>
      <style jsx>{`
        .ui-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: var(--shadow-hover);
        }
      `}</style>
    </>
  );
};

export default Card;
