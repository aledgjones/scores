import {
  mdiCheck,
  mdiCircle,
  mdiCursorDefault,
  mdiEraserVariant,
  mdiMagnifyMinusOutline,
  mdiMagnifyPlusOutline,
  mdiPen,
  mdiRedoVariant,
  mdiUndoVariant,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { FC, useState } from "react";
import { Color } from "../services/canvas";
import { Tool } from "../services/ui";
import IconButton from "../ui/components/icon-button";

interface Props {
  isDrawing: boolean;
  tool: Tool;
  onChangeTool: (value: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  scale: number;
  onChangeColor: (value: Color) => void;
  color: Color;
}

export const Toolbox: FC<Props> = ({
  isDrawing,
  tool,
  onChangeTool,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  scale,
  onChangeColor,
  color,
}) => {
  const [colorOpen, setColorOpen] = useState(false);

  if (!isDrawing) {
    return null;
  }

  return (
    <>
      {colorOpen && (
        <div className="color-picker">
          <IconButton
            onClick={() => {
              onChangeColor(Color.black);
              setColorOpen(false);
            }}
            className="margin"
            ariaLabel="Black"
          >
            <Icon path={mdiCircle} size={1} color={Color.black} />
          </IconButton>
          <IconButton
            onClick={() => {
              onChangeColor(Color.red);
              setColorOpen(false);
            }}
            className="margin"
            ariaLabel="Black"
          >
            <Icon path={mdiCircle} size={1} color={Color.red} />
          </IconButton>
          <IconButton
            onClick={() => {
              onChangeColor(Color.green);
              setColorOpen(false);
            }}
            className="margin"
            ariaLabel="Black"
          >
            <Icon path={mdiCircle} size={1} color={Color.green} />
          </IconButton>
          <IconButton
            onClick={() => {
              onChangeColor(Color.blue);
              setColorOpen(false);
            }}
            ariaLabel="Black"
          >
            <Icon path={mdiCircle} size={1} color={Color.blue} />
          </IconButton>
        </div>
      )}
      <div className="toolbox">
        <IconButton
          onClick={() => onChangeTool(Tool.cursor)}
          className={classNames("margin", {
            "icon--selected": tool === Tool.cursor,
          })}
          ariaLabel="Cursor tool"
        >
          <Icon path={mdiCursorDefault} size={1} />
        </IconButton>
        <IconButton
          onClick={() => {
            if (tool === Tool.pen) {
              setColorOpen((s) => !s);
            } else {
              onChangeTool(Tool.pen);
            }
          }}
          className={classNames("margin", "pen", {
            "icon--selected": tool === Tool.pen,
          })}
          ariaLabel="Pencil tool"
        >
          <Icon path={mdiPen} size={1} />
        </IconButton>
        <IconButton
          onClick={() => onChangeTool(Tool.eraser)}
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
        .toolbox,
        .color-picker {
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
        .color-picker {
          left: 76px;
          z-index: 2001;
        }
        .toolbox :global(.margin),
        .color-picker :global(.margin) {
          margin-bottom: 12px;
        }
        .toolbox :global(.pen.icon--selected) {
          background-color: ${color} !important;
        }
        .toolbox :global(.pen:after) {
          position: absolute;
          top: calc(50% - 2px);
          left: 28px;
          content: "";
          height: 0;
          width: 0;
          border-top: 4px solid transparent;
          border-left: 4px solid black;
          border-bottom: 4px solid transparent;
        }
        .toolbox :global(.pen.icon--selected:after) {
          left: 34px;
          border-left: 4px solid ${color};
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
