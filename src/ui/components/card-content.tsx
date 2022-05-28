import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  children: ReactNode;
}

const CardContent: FC<Props> = ({ children, className }) => {
  return (
    <>
      <div className={classNames("ui-card-content", className)}>{children}</div>
      <style jsx>{`
        .ui-card-content {
          padding: var(--padding);
        }
      `}</style>
    </>
  );
};

export default CardContent;
