import {
  mdiCheck,
  mdiCursorPointer,
  mdiEraserVariant,
  mdiMagnifyMinusOutline,
  mdiMagnifyPlusOutline,
  mdiPen,
  mdiRedoVariant,
  mdiUndoVariant,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { FC } from "react";
import { Tool } from "../services/ui";
import IconButton from "../ui/components/icon-button";

interface Props {
  isDrawing: boolean;
  tool: Tool;
  onChange: (value: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  scale: number;
}

export const Toolbox: FC<Props> = ({
  isDrawing,
  tool,
  onChange,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  scale,
}) => {
  if (!isDrawing) {
    return null;
  }

  return (
    <>
      <div className="toolbox">
        <IconButton
          onClick={() => onChange(Tool.cursor)}
          className={classNames("margin", {
            "icon--selected": tool === Tool.cursor,
          })}
          ariaLabel="Cursor tool"
        >
          <Icon path={mdiCursorPointer} size={1} />
        </IconButton>
        <IconButton
          onClick={() => onChange(Tool.pen)}
          className={classNames("margin", {
            "icon--selected": tool === Tool.pen,
          })}
          ariaLabel="Pencil tool"
        >
          <Icon path={mdiPen} size={1} />
        </IconButton>
        <IconButton
          onClick={() => onChange(Tool.eraser)}
          className={classNames("margin", {
            "icon--selected": tool === Tool.eraser,
          })}
          ariaLabel="Eraser tool"
        >
          <Icon path={mdiEraserVariant} size={1} />
        </IconButton>
        <div className="spacer" />
        <IconButton
          disabled={!canUndo}
          onClick={onUndo}
          className="margin"
          ariaLabel="Undo"
        >
          <Icon path={mdiUndoVariant} size={1} />
        </IconButton>
        <IconButton
          disabled={!canRedo}
          onClick={onRedo}
          className="margin"
          ariaLabel="Redo"
        >
          <Icon path={mdiRedoVariant} size={1} />
        </IconButton>
        <div className="spacer" />
        <IconButton onClick={onZoomIn} className="margin" ariaLabel="Zoom In">
          <Icon path={mdiMagnifyPlusOutline} size={1} />
        </IconButton>
        <IconButton
          disabled={scale === 1}
          onClick={onZoomOut}
          className="margin"
          ariaLabel="Zoom In"
        >
          <Icon path={mdiMagnifyMinusOutline} size={1} />
        </IconButton>
        <div className="spacer" />
        <IconButton onClick={onSave} className="save" ariaLabel="Save">
          <Icon path={mdiCheck} size={1} />
        </IconButton>
      </div>
      <style jsx>{`
        .toolbox {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          padding: 8px 0;
          width: 48px;
          box-shadow: var(--shadow);
          border-radius: 24px;
          z-index: 2000;
          background-color: #fff;
          pointer-events: all;
        }
        .toolbox :global(.margin) {
          margin-bottom: 12px;
        }
        .toolbox :global(.icon--selected) {
          background-color: var(--black) !important;
          color: var(--on-primary);
        }
        .toolbox :global(.save) {
          background-color: rgb(var(--primary)) !important;
          color: var(--on-primary);
        }
        .spacer {
          width: 24px;
          height: 1px;
          background-color: rgb(200, 200, 200);
          margin-top: 8px;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
};
