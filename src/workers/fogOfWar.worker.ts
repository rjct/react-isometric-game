import { constants } from "../constants";
import { GameMap } from "../engine/GameMap";
import { floor } from "../engine/helpers";

export type WogOfWarWorkerProps = {
  mapSize: Size;
  fogOfWarMatrix: GameMap["fogOfWarMatrix"];
};

onmessage = function (e: MessageEvent<WogOfWarWorkerProps>) {
  const { mapSize, fogOfWarMatrix } = e.data;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = mapSize.width * wireframeTileWidth;
  const mapHeight = mapSize.height * wireframeTileHeight;

  const isCellVisited = (x: number, y: number) => {
    return fogOfWarMatrix[floor(y)][floor(x)] > 0;
  };

  const canvas = new OffscreenCanvas(mapWidth, mapHeight);
  const ctx = canvas.getContext("2d")! as OffscreenCanvasRenderingContext2D;

  const hideFill = `rgba( 0, 0, 0, ${constants.FOG_OF_WAR_OPACITY})`;
  const r2 = wireframeTileWidth * 1.3;
  const r1 = r2 / 3;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = hideFill;
  ctx.fillRect(0, 0, mapWidth, mapHeight);

  ctx.globalCompositeOperation = "destination-out";

  const progress: OffscreenCanvasRenderingProgress = {
    percent: 0,
    complete: false,
  };

  let counter = 0;

  for (let y = 0; y < fogOfWarMatrix.length; y++) {
    for (let x = 0; x < fogOfWarMatrix[y].length; x++) {
      if (isCellVisited(x, y)) {
        const x2 = x * wireframeTileWidth + wireframeTileWidth / 2;
        const y2 = y * wireframeTileHeight + wireframeTileHeight / 2;

        const radGrd = ctx.createRadialGradient(x2, y2, r1, x2, y2, r2);
        radGrd.addColorStop(0, "rgba( 0, 0, 0,  1 )");
        radGrd.addColorStop(0.8, "rgba( 0, 0, 0, .1 )");
        radGrd.addColorStop(1, "rgba( 0, 0, 0,  0 )");

        ctx.fillStyle = radGrd;

        ctx.fillRect(x2 - r2, y2 - r2, r2 * 2, r2 * 2);
      }

      postMessage({
        ...progress,
        ...{
          percent: Math.round((counter++ / (fogOfWarMatrix.length * fogOfWarMatrix.length)) * 100),
        },
      });
    }
  }

  postMessage({
    ...progress,
    ...{
      percent: 100,
      complete: true,
      data: ctx.getImageData(0, 0, mapWidth, mapHeight),
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // canvas[canvas.convertToBlob ? "convertToBlob" : "toBlob"]().then((blob) => {
  //   const dataURL = new FileReaderSync().readAsDataURL(blob);
  //   postMessage(dataURL);
  // });
};

export default {};
