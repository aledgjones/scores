import { useCallback, useState, useEffect, FC, ReactNode } from "react";
import { mdiFileUploadOutline } from "@mdi/js";
import { fileAccepted } from "../utils/file-accepted";
import classNames from "classnames";
import Icon from "@mdi/react";

interface Props {
  className?: string;
  accept?: string[];
  onDrop: (files: File[], discarded: number) => void;
  children: ReactNode;
}

const DropFile: FC<Props> = ({ className, children, accept, onDrop }) => {
  const [over, setOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const filtered = files.filter((file) => fileAccepted(file, accept));
        onDrop(filtered, files.length - filtered.length);
      }
      setOver(false);
    },
    [accept, onDrop]
  );

  useEffect(() => {
    // prevent defaults makes drag and drop work
    const dragover = (e: Event) => {
      e.preventDefault();
    };

    const drop = (e: Event) => {
      e.preventDefault();
      setOver(false);
    };

    const dragenter = (e: any) => {
      // if we don't have an element we have come from, we are coming from outside the window
      if (e.relatedTarget == null) {
        setOver(true);
      }
    };

    const dragleave = (e: any) => {
      // if we don't have an element we are going to, we are going outside the window
      if (e.relatedTarget == null) {
        setOver(false);
      }
    };
    window.addEventListener("drop", drop);
    window.addEventListener("dragenter", dragenter);
    window.addEventListener("dragleave", dragleave);
    window.addEventListener("dragover", dragover);
    return () => {
      window.removeEventListener("drop", drop);
      window.removeEventListener("dragenter", dragenter);
      window.removeEventListener("dragleave", dragleave);
      window.removeEventListener("dragenter", dragover);
    };
  }, []);

  return (
    <>
      <div className={classNames("ui-dropzone", className)} onDrop={handleDrop}>
        {children}
        {over && (
          <div className="ui-dropzone__hover-container">
            <div className="ui-dropzone__hover-content">
              <Icon path={mdiFileUploadOutline} size={2} color="#aaaaaa" />
              <p className="ui-dropzone__hover-text">Drop files here</p>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .ui-dropzone {
          position: relative;
        }

        .ui-dropzone__hover-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 40px;
          z-index: 100;
        }

        .ui-dropzone__hover-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          border: 4px dashed rgb(175, 175, 175);
          pointer-events: none;
        }

        .ui-dropzone__hover-text {
          color: rgb(150, 150, 150);
          margin-top: 4px;
        }
      `}</style>
    </>
  );
};

export default DropFile;
