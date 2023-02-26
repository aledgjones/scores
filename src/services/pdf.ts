import { GlobalWorkerOptions, getDocument, PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";
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

  return canvas.toBlob({ type: "image/webp", quality: 0.5 });
};

type CacheEntry = { pdf: Blob; thumb: Blob };

export const usePDF = (
  index: number,
  scoreKey: string,
  partKey: string,
  onReset: () => void = () => {}
) => {
  const page = index + 1;

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState<{ [page: string]: string }>({});
  const rendered = useRef({});

  useEffect(() => {
    let doc: PDFDocumentProxy | null = null;

    (async () => {
      const key = `/${scoreKey}/${partKey}.pdf`;
      const { pdf, thumb } = await cache.getItem<CacheEntry>(key);

      rendered.current[1] = true;
      setPages(() => {
        return { 0: URL.createObjectURL(thumb) };
      });

      doc = await getPdf(pdf);

      setPdf(doc);
      setCount(doc.numPages);
    })();

    return () => {
      rendered.current = {};
      doc?.destroy();
      onReset();
      setPdf(null);
      setPages((s) => {
        for (const url of Object.values(s)) {
          URL.revokeObjectURL(url);
        }
        return {};
      });
    };
  }, [scoreKey, partKey]);

  useEffect(() => {
    if (!pdf) {
      return;
    }

    (async () => {
      const min = Math.max(1, page);
      const max = Math.min(page + 2, pdf.numPages);

      for (let i = min; i <= max; i++) {
        if (rendered.current[i]) {
          continue;
        } else {
          rendered.current[i] = true;
        }

        console.log("RENDER:", i);

        const blob = await renderPage(pdf, i);
        const url = URL.createObjectURL(blob);

        setPages((s) => {
          return { ...s, [i - 1]: url };
        });
      }
    })();
  }, [pdf, page]);

  return { count, pages };
};
