import { LightRay, LightRayData } from "../engine/LightRayFactory";
import { constants } from "../constants";
import { GameMap } from "../engine/GameMap";

export type LightsAndShadowsWorkerProps = {
  mapSize: Size;
  featureEnabled: {
    shadow: boolean;
    light: boolean;
  };
  shadows: GameMap["shadows"];
  lightRaysData: Array<LightRayData>;
};

onmessage = function (e: MessageEvent<LightsAndShadowsWorkerProps>) {
  const { mapSize, featureEnabled, shadows, lightRaysData } = e.data;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = mapSize.width * wireframeTileWidth;
  const mapHeight = mapSize.height * wireframeTileHeight;

  const canvas = new OffscreenCanvas(mapWidth, mapHeight);
  const ctx = canvas.getContext("2d")! as OffscreenCanvasRenderingContext2D;

  const progress: OffscreenCanvasRenderingProgress = {
    percent: 0,
    complete: false,
  };

  let counter = 0;

  ctx.globalCompositeOperation = "source-over";

  if (featureEnabled.shadow) {
    ctx.globalAlpha = shadows.opacity;
    ctx.fillStyle = shadows.color;
    ctx.fillRect(0, 0, mapWidth, mapHeight);
  }

  ctx.lineWidth = 1;
  for (const ray of lightRaysData) {
    if (featureEnabled.shadow) {
      ctx.globalCompositeOperation = "destination-out";
      LightRay.draw(ctx, ray, false);
    }

    if (featureEnabled.light) {
      ctx.globalCompositeOperation = "xor"; //"source-atop";

      LightRay.draw(ctx, ray, true);
    }

    postMessage({
      ...progress,
      ...{
        percent: Math.round((counter++ / lightRaysData.length) * 100),
      },
    });
  }

  postMessage({
    ...progress,
    ...{
      percent: 100,
      complete: true,
      data: ctx.getImageData(0, 0, mapWidth, mapHeight),
    },
  });
};

export default {};
