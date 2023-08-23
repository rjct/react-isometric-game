import { constants } from "../constants";
import React from "react";
import { GameMap } from "../engine/GameMap";

export function usePreloadAssets() {
  const [totalMediaFiles, setTotalMediaFiles] = React.useState(0);
  const [totalMediaFilesLoaded, setTotalMediaFilesLoaded] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const preloadAssets = async (gameState: GameMap): Promise<MediaAssets> => {
    const loadImage = (assetFile: AssetFileImage): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = assetFile.value;

        loadImg.onload = () => resolve(loadImg);

        loadImg.onerror = (err) => reject(err);
      });
    };

    const loadAudio = async (assetFile: AssetFileAudio): Promise<AudioBuffer> => {
      const response = await fetch(assetFile.value);
      const arrayBuffer = await response.arrayBuffer();

      return await gameState.audioContext.decodeAudioData(arrayBuffer);
    };

    return new Promise((resolve) => {
      let mediaFiles: MediaAssets;

      fetch(`${constants.BASE_URL}/media-assets-manifest.json`).then(async (data) => {
        const json = await data.json();

        mediaFiles = Object.keys(json).reduce((obj, key) => {
          return { ...obj, [key]: json[key] };
        }, {});

        const mediaFilesUrls = Object.keys(mediaFiles);

        setTotalMediaFiles(mediaFilesUrls.length);

        Promise.all(
          mediaFilesUrls.map((url) => {
            const assetFile = mediaFiles[url];

            switch (assetFile.type) {
              case "image":
                return loadImage(assetFile).then((imageElement) => {
                  setTotalMediaFilesLoaded((prev) => prev + 1);

                  mediaFiles[url].source = imageElement;
                });

              case "audio":
                return loadAudio(assetFile).then((audioElement: AudioBuffer) => {
                  setTotalMediaFilesLoaded((prev) => prev + 1);

                  mediaFiles[url].source = audioElement;
                });
            }
          }),
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
