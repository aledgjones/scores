import Icon from "@mdi/react";
import classNames from "classnames";
import { FC, ReactNode } from "react";

interface Props {
  path: string;
  margin?: boolean;
  children: ReactNode;
}

const Tag: FC<Props> = ({ path, margin, children }) => {
  return (
    <>
      <div className={classNames("tag", { "tag--margin": margin })}>
        <Icon path={path} size={0.5} />
        <div className="tag-content">{children}</div>
      </div>
      <style jsx>{`
        .tag {
          display: flex;
          align-items: center;
          color: rgb(var(--primary));
          border-radius: 16px;
          height: 22px;
          white-space: nowrap;
          line-height: 1em;
          padding: 0 10px 0 8px;
          background-color: rgb(var(--primary));
          color: var(--on-primary);
          font-size: 12px;
        }
        .tag--margin {
          margin-right: 20px;
        }
        .tag-content {
          margin-left: 4px;
        }
      `}</style>
    </>
  );
};

export default Tag;
