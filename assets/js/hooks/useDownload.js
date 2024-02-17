import { useState } from "react";
import { backend } from "../utils/axiosConfig";

export function useDownload(url) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const download = (payload = {}) => {
    console.log("downloading with url", url);
    setError(null);
    setDownloading(true);
    backend
      .post(url, payload, {
        responseType: "arraybuffer",
      })
      .then(({ headers, data }) => {
        console.log("response headers", headers);
        const blob = new Blob([data]);
        downloadBlob(blob, headers["file-name"]);
        setDownloading(false);
      })
      .catch((err) => {
        console.error("Error downloading document", err);
        setError(err);
        setDownloading(false);
      });
  };
  return { downloading, error, download };
}

export const downloadBlob = (blob, filename) => {
  const objUrl = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.setAttribute("href", objUrl);
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(objUrl);
  a = null;
};
