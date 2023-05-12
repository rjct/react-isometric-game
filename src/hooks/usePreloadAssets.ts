import { constants } from "../constants";
import React from "react";

export function usePreloadAssets() {
  const [totalMediaFiles, setTotalMediaFiles] = React.useState(0);
  const [totalMediaFilesLoaded, setTotalMediaFilesLoaded] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const loadImage = (image: { value: string; size: number }): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image.value;

      loadImg.onload = () => resolve(loadImg);

      loadImg.onerror = (err) => reject(err);
    });
  };

  const preloadAssets = async (): Promise<MediaFiles> => {
    return new Promise((resolve) => {
      let mediaFiles: MediaFiles;

      fetch(`${constants.BASE_URL}/media-assets-manifest.json`).then(async (data) => {
        const json = await data.json();

        mediaFiles = Object.keys(json).reduce((obj, key) => {
          return { ...obj, [key]: json[key] };
        }, {});

        const mediaFilesUrls = Object.keys(mediaFiles);

        setTotalMediaFiles(mediaFilesUrls.length);

        Promise.all(
          mediaFilesUrls.map((url) => {
            const image = mediaFiles[url];

            return loadImage(image).then((imageElement) => {
              setTotalMediaFilesLoaded((prev) => prev + 1);

              mediaFiles[url].img = imageElement;
            });
          })
        ).finally(() => {
          setLoading(false);

          return resolve(mediaFiles);
        });
      });
    });
  };

  return {
    preloadAssets,
    loadingState: { loading, total: totalMediaFiles, loaded: totalMediaFilesLoaded },
  };
}
