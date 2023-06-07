import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useCanvas } from "../../../hooks/useCanvas";
import { constants } from "../../../constants";

export const LightsAndShadows = React.memo(() => {
  const { gameState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { clearCanvas } = useCanvas();

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;

    clearCanvas(ctx);

    if (gameState.debug.featureEnabled.light) {
      const hideFill = "rgba(0,13,35,0.85)";
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = hideFill;
      ctx.fillRect(
        0,
        0,
        gameState.mapSize.width * constants.wireframeTileSize.width,
        gameState.mapSize.height * constants.wireframeTileSize.height
      );

      ctx.lineWidth = 0;
      ctx.globalAlpha = 0.9;

      gameState.lights.forEach((light) => {
        const { ray } = light;
        const radius = light.radius * constants.wireframeTileSize.width;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ray.x = light.position.x * constants.wireframeTileSize.width;
        ray.y = light.position.y * constants.wireframeTileSize.height;

        ctx.setTransform(1, 0, 0, 1, ray.x, ray.y);
        ctx.beginPath();
        ctx.globalCompositeOperation = "destination-out";

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / (180 * constants.LIGHT_RENDER_PASSES)) {
          ray.setDirection(angle);

          ray.len = radius;
          ray.cast(gameState.buildings);
          ray.pathEnd(ctx);
          ray.draw(ctx);
        }

        ctx.closePath();
      });

      ctx.fill();
    }
  }, [
    JSON.stringify(gameState.lights),
    gameState.debug.featureEnabled.light,
    gameState.debug.featureEnabled.unitShadow,
  ]);

  React.useEffect(() => {
    if (gameState.debug.featureEnabled.unitShadow) {
      gameState.getAllAliveUnitsArray().forEach((unit) => {
        unit.calcShadows(gameState);
      });
    }
  }, [JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.position))]);

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
