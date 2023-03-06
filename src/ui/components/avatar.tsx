import classNames from "classnames";
import { FC, ReactNode } from "react";

interface Props {
  color: string;
  large?: boolean;
  margin?: boolean;
  image?: string;
  children: ReactNode;
}

const Avatar: FC<Props> = ({ children, color, large, image, margin }) => {
  return (
    <>
      <div
        className={classNames("avatar", {
          "avatar--large": large,
          "avatar--margin": margin,
        })}
        style={{
          backgroundColor: color,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
        }}
      >
        {!image && children}
      </div>
      <style jsx>{`
        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          height: 40px;
          width: 40px;
          min-width: 40px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          line-height: 1em;
          background-color: #aaa;
        }
        .avatar--large {
          height: 72px;
          width: 72px;
          min-width: 72px;
          font-size: 42px;
        }
        .avatar--margin {
          margin-right: 20px;
        }
      `}</style>
    </>
  );
};

export default Avatar;
