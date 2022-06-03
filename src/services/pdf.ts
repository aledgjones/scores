import { GlobalWorkerOptions, getDocument, PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useState } from "react";
import { cache } from "./cache";
import { fitAInsideB } from "./utils";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export const getPdf = async (file: Blob) => {
  const buffer: any = await file.arrayBuffer();
  return getDocument(buffer).promise;
};

export const renderPage = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const naturalViewport = page.getViewport({ scale: 1.0 });
  const scale = fitAInsideB(naturalViewport, {
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const viewport = page.getViewport({ scale: scale * window.devicePixelRatio });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d", { alpha: false });
  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
  });
  await renderTask.promise;
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/webp");
  });
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
