import { WogOfWarWorkerProps } from "../workers/fogOfWar.worker";
import { GameMap } from "../engine/GameMap";
import React from "react";
import { UIReducerAction } from "../reducers/ui/_reducers";

const worker = new Worker(new URL("../workers/fogOfWar.worker.ts", import.meta.url));

export function useFogOfWar(gameState: GameMap, uiDispatch: React.Dispatch<UIReducerAction>) {
  const renderFogOfWar = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      const workerProps: WogOfWarWorkerProps = {
        mapSize: gameState.mapSize,
        fogOfWarMatrix: gameState.fogOfWarMatrix,
      };

      worker.postMessage(workerProps);

      worker.onmessage = (e) => {
        const progress: OffscreenCanvasRenderingProgress = e.data;

        uiDispatch({ type: "updateOffscreenCanvasRenderingProgress", entity: "fogOfWar", progress });

        if (progress.complete && progress.data) {
          ctx.putImageData(progress.data, 0, 0);
        }
      };
    }
  };

  return { renderFogOfWar };
}
