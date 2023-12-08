import getBuildingsDictList from "@src/dict/building/_building";
import getUnitsDictList from "@src/dict/unit/_unit";
import getVehiclesDictList from "@src/dict/vehicle/_vehicle";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { generateClipPath } from "@src/engine/generateClipPath";
import React from "react";

export type AssetsLoadingState = {
  image: {
    count: number;
    size: number;
  };
  audio: {
    count: number;
    size: number;
  };
  clipPath: number;
};

export function usePreloadAssets() {
  const [totalMediaFiles, setTotalMediaFiles] = React.useState<AssetsLoadingState>({
    image: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
    clipPath: 0,
  });
  const [totalMediaFilesLoaded, setTotalMediaFilesLoaded] = React.useState<AssetsLoadingState>({
    image: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
    clipPath: 0,
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
        const clipPaths = Object.values({
          ...getUnitsDictList(),
          ...getBuildingsDictList(),
          ...getVehiclesDictList(),
        });

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
          clipPath: clipPaths.reduce((count, dictEntity) => {
            const rotationAnglesCount = Object.values(dictEntity.clipPath).reduce((previousValue, currentValue) => {
              return previousValue + Object.keys(currentValue).length;
            }, 0);

            return count + rotationAnglesCount;
          }, 0),
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

        Promise.all([gfxPromises, sfxPromises].flat()).then(() => {
          const clipPathPromises: Promise<void>[] = [];

          clipPaths.forEach(async (dictEntity) => {
            Object.entries(dictEntity.clipPath).forEach(([entityVariant, variantRotationAngles]) => {
              Object.entries(variantRotationAngles).forEach(([rotationAngle, rotationAngleObj], index) => {
                const asset = mediaFiles.image[rotationAngleObj.spriteUrl];

                clipPathPromises.push(
                  (async () => {
                    if (asset) {
                      let shiftX: number;
                      let shiftY: number;

                      switch (dictEntity.interfaceType) {
                        case "building":
                          // FIXME: Refactor assets
                          const rotationVariantByDeg = {
                            "0deg": 0,
                            "270deg": 1,
                            "90deg": 2,
                            "180deg": 3,
                          };

                          shiftX = rotationVariantByDeg[rotationAngle as keyof typeof rotationVariantByDeg];
                          shiftY = Number(entityVariant);
                          break;

                        default:
                          shiftX = 0;
                          shiftY = index;
                      }

                      dictEntity.clipPath[entityVariant][rotationAngle].cssClipPath = await generateClipPath(
                        asset.source,
                        dictEntity.size.screen,
                        shiftX,
                        shiftY,
                      );

                      setTotalMediaFilesLoaded((prev) => {
                        prev.clipPath++;

                        return { ...prev };
                      });
                    }
                  })(),
                );
              });
            });
          });

          Promise.all(clipPathPromises).then(() => {
            setLoading(false);

            return resolve(mediaFiles);
          });
        });
      });
    });
  };

  return {
    preloadAssets,
    loadingState: { loading, total: totalMediaFiles, loaded: totalMediaFilesLoaded },
  };
}
