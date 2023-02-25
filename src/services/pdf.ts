import {
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
} from "pdfjs-dist/legacy/build/pdf";
import { useEffect, useState } from "react";
import { getOffscreenCanvas } from "../ui/utils/get-offscreen-canvas";
import { cache } from "./cache";
import { fitAInsideB } from "./utils";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export const getPdf = async (file: Blob) => {
  const buffer: any = await file.arrayBuffer();
  return getDocument(buffer).promise;
};

export const renderPage = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const width: number = screen.width * devicePixelRatio;
  const height: number = screen.height * devicePixelRatio;

  const page = await pdf.getPage(pageNumber);
  const naturalViewport = page.getViewport({ scale: 1.0 });
  const scale = Math.max(
    fitAInsideB(naturalViewport, { width, height }),
    fitAInsideB(naturalViewport, { width, height })
  );
  const viewport = page.getViewport({ scale });
  const canvas = getOffscreenCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext("2d", { alpha: false });
  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
  });
  await renderTask.promise;
  return canvas.toBlob({ type: "image/webp" });
};

export const usePDF = (
  scoreKey: string,
  partKey: string,
  onReset?: () => void
) => {
  const [pages, setPages] = useState<string[]>([null]);

  useEffect(() => {
    let unmounted = false;
    const urls = [];
    (async () => {
      if (onReset) {
        setPages([]);
        onReset();
      }
      const key = `/${scoreKey}/${partKey}.pdf`;
      const imgs = (await cache.getItem<Blob[]>(key)) || [];
      if (!unmounted) {
        setPages(() => {
          return imgs.map((img) => {
            const url = URL.createObjectURL(img);
            urls.push(url);
            return url;
          });
        });
      }
    })();
    return () => {
      unmounted = true;
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [scoreKey, partKey]);

  return { count: pages.length || 0, pages };
};
