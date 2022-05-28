import { mdiDrag } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { FC } from "react";
import { SortableHandle } from "react-sortable-hoc";

interface Props {
  disabled?: boolean;
}

const Handle: FC<Props> = ({ disabled }) => {
  return (
    <>
      <Icon
        className={classNames("playlist-handle", {
          "playlist-handle--disabled": disabled,
        })}
        path={mdiDrag}
        size={1}
        color="rgb(150,150,150)"
        style={{ cursor: "grab" }}
      />
      <style jsx>{`
        :global(.playlist-handle) {
          min-width: 24px;
        }
        :global(.playlist-handle--disabled) {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default SortableHandle<Props>(Handle);
