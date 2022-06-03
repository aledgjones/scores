interface BlobOptions {
  type?: string;
  quality?: number;
}

export function getOffscreenCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    return {
      getContext: canvas.getContext.bind(canvas),
      toBlob: (options: BlobOptions) => {
        return canvas.convertToBlob(options);
      },
    };
  } else {
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    return {
      getContext: canvas.getContext.bind(canvas),
      toBlob: (options: BlobOptions) => {
        return new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), options.type, options.quality);
        });
      },
    };
  }
}
