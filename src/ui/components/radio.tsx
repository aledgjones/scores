import { FC } from "react";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiRadioboxMarked, mdiRadioboxBlank } from "@mdi/js";

interface Props {
  value: boolean;
  className?: string;
  margin?: boolean;
}

const Radio: FC<Props> = ({ value, className, margin }) => {
  return (
    <>
      <Icon
        className={classNames("ui-radio", className, {
          "ui-radio--active": value,
          "ui-radio--margin": margin,
        })}
        path={value ? mdiRadioboxMarked : mdiRadioboxBlank}
        size={1}
      />
      <style jsx>{`
        :global(.ui-radio) {
          color: rgb(150, 150, 150);
          margin-right: 12px;
          cursor: pointer;
        }
        :global(.ui-radio--active) {
          color: rgb(var(--primary));
        }
        :global(.ui-radio--margin) {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};

export default Radio;
