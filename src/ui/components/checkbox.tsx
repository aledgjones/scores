import { FC } from "react";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";

interface Props {
  value: boolean;
  className?: string;
  margin?: boolean;
}

const Checkbox: FC<Props> = ({ value, className, margin }) => {
  return (
    <>
      <Icon
        className={classNames("ui-checkbox", className, {
          "ui-checkbox--active": value,
          "ui-checkbox--margin": margin,
        })}
        path={value ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
        size={1}
      />
      <style jsx>{`
        :global(.ui-checkbox) {
          color: rgb(150, 150, 150);
          margin-right: 12px;
          cursor: pointer;
        }
        :global(.ui-checkbox--active) {
          color: rgb(var(--primary));
        }
        :global(.ui-checkbox--margin) {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};

export default Checkbox;
