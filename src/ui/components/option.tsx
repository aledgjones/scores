import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  value: any;
  className?: string;
  onChange?: (val: any) => void;
  children: ReactNode;
}

const Option: FC<Props> = ({ value, children, className, onChange }) => {
  return (
    <>
      <li
        onClick={() => onChange(value)}
        role="option"
        className={classNames("ui-option", className)}
      >
        {children}
      </li>
      <style jsx>{`
        .ui-option {
          display: flex;
          align-items: center;
          height: 44px;
          width: 100%;
          padding: 0 16px;
          cursor: pointer;
        }
        .ui-option:hover {
          background-color: rgb(245, 245, 245);
        }
      `}</style>
    </>
  );
};

export default Option;
