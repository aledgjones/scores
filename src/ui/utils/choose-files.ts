import { fileAccepted } from "./file-accepted";

export function chooseFiles(config?: {
  accept?: string[];
  multiple?: boolean;
}) {
  const input = document.createElement("input");
  input.type = "file";
  input.style.position = "fixed";
  input.style.visibility = "hidden";
  input.style.left = "-100000px";
  input.style.top = "-100000px";

  if (config) {
    if (config.accept) {
      input.accept = config.accept.join(",");
    }
    if (config.multiple) {
      input.multiple = config.multiple;
    }
  }

  document.body.appendChild(input);

  return new Promise<{ files: File[]; discarded: number }>(
    (resolve, reject) => {
      let timeout: any;

      const focus = () => {
        timeout = setTimeout(change, 500);
      };

      const change = () => {
        clearTimeout(timeout);
        window.removeEventListener("focus", focus);
        input.removeEventListener("change", change);
        const files = input.files ? Array.from(input.files) : [];
        const filtered = files.filter((file) =>
          fileAccepted(file, config && config.accept)
        );
        resolve({ files: filtered, discarded: files.length - filtered.length });
        input.remove();
      };

      // slightly shit, the change event always fires slightly after the focus event
      // input.files not updated until change fired so we have to wait after focus event
      // to see if it's a file select or actual just a cancel
      window.addEventListener("focus", focus);
      input.addEventListener("change", change);

      input.click();
    }
  );
}
