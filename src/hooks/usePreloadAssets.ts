import { constants } from "../constants";
import React from "react";
import { GameMap } from "../engine/GameMap";

export type AssetsLoadingState = {
  image: {
    count: number;
    size: number;
  };
  audio: {
    count: number;
    size: number;
  };
};

export function usePreloadAssets() {
  const [totalMediaFiles, setTotalMediaFiles] = React.useState<AssetsLoadingState>({
    image: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
  });
  const [totalMediaFilesLoaded, setTotalMediaFilesLoaded] = React.useState<AssetsLoadingState>({
    image: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
  });
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

        mediaFiles = Object.keys(json).reduce(
          (obj, key) => {
            const assetFile = json[key] as AssetFileImage | AssetFileAudio;

            obj[assetFile.type][key] = assetFile;

            return obj;
          },
          {
            image: {},
            audio: {},
          } as MediaAssets,
        );

        const gfxUrls = Object.keys(mediaFiles.image);
        const sfxUrls = Object.keys(mediaFiles.audio);

        setTotalMediaFiles({
          image: {
            count: gfxUrls.length,
            size: Object.values(mediaFiles.image).reduce((count, value) => {
              return count + value.size;
            }, 0),
          },
          audio: {
            count: sfxUrls.length,
            size: Object.values(mediaFiles.audio).reduce((count, value) => {
              return count + value.size;
            }, 0),
          },
        });

        const gfxPromises = gfxUrls.map(async (url) => {
          const assetFile = mediaFiles.image[url];
          const imageElement = await loadImage(assetFile);

          setTotalMediaFilesLoaded((prev) => {
            prev.image.count++;
            prev.image.size += assetFile.size;

            return { ...prev };
          });
          mediaFiles.image[url].source = imageElement;
        });

        const sfxPromises = sfxUrls.map(async (url) => {
          const assetFile = mediaFiles.audio[url];
          const audioElement = await loadAudio(assetFile);

          setTotalMediaFilesLoaded((prev) => {
            prev.audio.size += assetFile.size;
            prev.audio.count++;

            return { ...prev };
          });
          mediaFiles.audio[url].source = audioElement;
        });

        Promise.all([gfxPromises, sfxPromises].flat()).finally(() => {
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
