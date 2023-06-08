import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useCanvas } from "../../../hooks/useCanvas";
import { constants } from "../../../constants";

export const LightsAndShadows = React.memo(() => {
  const { gameState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { clearCanvas } = useCanvas();

  const callAllUnitsShadows = () => {
    if (gameState.debug.featureEnabled.unitShadow) {
      gameState.getAllAliveUnitsArray().forEach((unit) => {
        unit.calcShadows(gameState);
      });
    }
  };

  const renderLightsAndShadows = (ctx: CanvasRenderingContext2D) => {
    if (gameState.debug.featureEnabled.light || gameState.debug.featureEnabled.shadow) {
      ctx.globalCompositeOperation = "source-over";

      if (gameState.debug.featureEnabled.shadow) {
        ctx.globalAlpha = constants.light.SHADOWS_ALPHA;
        ctx.fillStyle = constants.light.SHADOWS_COLOR;
        ctx.fillRect(
          0,
          0,
          gameState.mapSize.width * constants.wireframeTileSize.width,
          gameState.mapSize.height * constants.wireframeTileSize.height
        );
      }

      ctx.lineWidth = 0;

      gameState.lights.forEach((light) => {
        light.rays.forEach((ray) => {
          ray.pathEnd(ctx);

          if (gameState.debug.featureEnabled.shadow) {
            ctx.globalCompositeOperation = "destination-out";

            ray.draw(ctx, false);
          }

          if (gameState.debug.featureEnabled.light) {
            ctx.globalCompositeOperation = "xor"; //"source-atop";
            ray.draw(ctx);
          }
        });
      });
    }
  };

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;

    clearCanvas(ctx);

    renderLightsAndShadows(ctx);
    callAllUnitsShadows();
  }, [
    JSON.stringify(gameState.lights),
    gameState.debug.featureEnabled.light,
    gameState.debug.featureEnabled.shadow,
    gameState.debug.featureEnabled.unitShadow,
  ]);

  React.useEffect(() => {
    callAllUnitsShadows();
  }, [JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.position))]);

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
