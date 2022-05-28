import classNames from "classnames";
import { FC, ReactNode } from "react";

interface Props {
  inline?: boolean;
  children: ReactNode;
}

const Subheader: FC<Props> = ({ children, inline }) => {
  return (
    <>
      <h3
        className={classNames("ui-subheader", {
          "ui-subheader--inline": inline,
        })}
      >
        {children}
      </h3>
      <style jsx>{`
        .ui-subheader {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 700;
          padding: 0 35px;
          line-height: 48px;
          opacity: 0.8;
        }
        .ui-subheader--inline {
          padding: 0 16px;
        }
      `}</style>
    </>
  );
};

export default Subheader;
