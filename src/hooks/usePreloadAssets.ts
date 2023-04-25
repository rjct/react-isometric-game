import { constants } from "../constants";
import React from "react";

export function usePreloadAssets() {
  const [totalMediaFiles, setTotalMediaFiles] = React.useState(0);
  const [totalMediaFilesLoaded, setTotalMediaFilesLoaded] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const loadImage = (image: { value: string; size: number }) => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image.value;

      loadImg.onload = () => resolve(image);

      loadImg.onerror = (err) => reject(err);
    });
  };

  const preloadAssets = async () => {
    fetch(`${constants.BASE_URL}/media-assets-manifest.json`).then(async (data) => {
      const json = await data.json();

      const mediaFiles: { [origPath: string]: { value: string; size: number } } = Object.keys(json).reduce(
        (obj, key) => {
          return { ...obj, [key]: json[key] };
        },
        {}
      );

      const mediaFilesUrls = Object.values(mediaFiles);

      setTotalMediaFiles(mediaFilesUrls.length);

      Promise.all(
        mediaFilesUrls.map((image) => loadImage(image).then(() => setTotalMediaFilesLoaded((prev) => prev + 1)))
      ).finally(() => setLoading(false));
    });
  };

  return {
    preloadAssets,
    loadingState: { loading, total: totalMediaFiles, loaded: totalMediaFilesLoaded },
  };
}
