import { GameMap } from "../engine/GameMap";
import { LightRayData } from "../engine/LightRayFactory";
import { LightsAndShadowsWorkerProps } from "../workers/lightsAndShadows.worker";
import { GameScene, GameUI } from "../context/GameUIContext";
import React from "react";
import { UIReducerAction } from "../reducers/ui/_reducers";

const worker = new Worker(new URL("../workers/lightsAndShadows.worker.ts", import.meta.url));

export const useLightsAndShadows = (
  gameState: GameMap,
  uiState: GameUI,
  uiDispatch: React.Dispatch<UIReducerAction>
) => {
  const renderLightsAndShadows = (ctx: CanvasRenderingContext2D) => {
    const raysData = [] as Array<LightRayData>;

    for (const light of gameState.lights) {
      for (const ray of light.rays) {
        raysData.push(ray.getRayData());
      }
    }

    const lightEnabled = gameState.settings.featureEnabled.light;
    const shadowEnabled = gameState.settings.featureEnabled.shadow;
    const isAllowed =
      (["game", "combat", "editor", "inventory"] as GameScene[]).includes(uiState.scene) ||
      (uiState.scene === "editor" && uiState.editorMode === "lights");

    if (ctx && raysData.length > 0) {
      const workerProps: LightsAndShadowsWorkerProps = {
        mapSize: gameState.mapSize,
        featureEnabled: {
          light: lightEnabled && isAllowed,
          shadow: shadowEnabled && isAllowed,
        },
        shadows: gameState.shadows,
        lightRaysData: raysData,
      };

      worker.postMessage(workerProps);

      worker.onmessage = (e) => {
        const progress: OffscreenCanvasRenderingProgress = e.data;

        uiDispatch({ type: "updateOffscreenCanvasRenderingProgress", entity: "lightsAndShadows", progress });

        if (progress.complete && progress.data) {
          ctx.putImageData(progress.data, 0, 0);
        }
      };
    }
  };

  return { renderLightsAndShadows };
};
