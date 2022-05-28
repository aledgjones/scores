import { FC } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Divider: FC<Props> = ({ className }) => {
  return (
    <>
      <div className={classNames("ui-divider", className)} />
      <style jsx>{`
        .ui-divider {
          height: 1px;
          width: 100%;
          background-color: rgb(235, 235, 235);
        }
      `}</style>
    </>
  );
};

export default Divider;
