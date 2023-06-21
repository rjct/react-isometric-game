import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useCanvas } from "../../../hooks/useCanvas";
import { constants } from "../../../constants";

export const LightsAndShadows = React.memo(() => {
  const { gameState, uiState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { clearCanvas } = useCanvas();

  const renderLightsAndShadows = (ctx: CanvasRenderingContext2D) => {
    if (gameState.settings.featureEnabled.light || gameState.settings.featureEnabled.shadow) {
      ctx.globalCompositeOperation = "source-over";

      if (gameState.settings.featureEnabled.shadow) {
        ctx.globalAlpha = gameState.shadows.opacity;
        ctx.fillStyle = gameState.shadows.color;
        ctx.fillRect(
          0,
          0,
          gameState.mapSize.width * constants.wireframeTileSize.width,
          gameState.mapSize.height * constants.wireframeTileSize.height
        );
      }

      ctx.lineWidth = 0;

      if (gameState.settings.featureEnabled.light && gameState.settings.featureEnabled.shadow) {
        gameState.lights.forEach((light) => {
          light.rays.forEach((ray) => {
            ray.pathEnd(ctx);
          });
        });
      }

      if (gameState.settings.featureEnabled.shadow) {
        ctx.globalCompositeOperation = "destination-out";

        gameState.lights.forEach((light) => {
          light.rays.forEach((ray) => {
            ray.draw(ctx, false);
          });
        });
      }

      if (gameState.settings.featureEnabled.light) {
        ctx.globalCompositeOperation = "xor"; //"source-atop";

        gameState.lights.forEach((light) => {
          light.rays.forEach((ray) => {
            ray.draw(ctx);
          });
        });
      }
    }
  };

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;

    clearCanvas(ctx);

    if (uiState.scene === "game" || (uiState.scene === "editor" && uiState.editorMode === "light")) {
      renderLightsAndShadows(ctx);
    }
  }, [
    gameState.mapSize,
    uiState.scene === "editor" ? gameState.getLightsHash() : false,
    gameState.shadows,
    gameState.settings.featureEnabled.light,
    gameState.settings.featureEnabled.shadow,
    gameState.settings.featureEnabled.unitShadow,
    uiState.scene,
    uiState.editorMode,
  ]);

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
