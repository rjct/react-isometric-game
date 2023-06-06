import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { useCanvas } from "../../../hooks/useCanvas";
import { LightRay } from "../../../engine/LightRayFactory";
import { constants } from "../../../constants";

export const LightsAndShadows = React.memo(() => {
  const { gameState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const [rays, setRays] = React.useState<Array<LightRay>>();

  const { clearCanvas } = useCanvas();

  React.useEffect(() => {
    if (canvasRef.current) {
      setRays(
        Object.values(gameState.lights).map((entity) => new LightRay(canvasRef.current.getContext("2d")!, entity))
      );
    }
  }, [Object.values(gameState.units).length, canvasRef.current, JSON.stringify(gameState.lights)]);

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;

    if (!rays || !gameState.debug.featureEnabled.light) {
      if (canvasRef.current) {
        clearCanvas(ctx);
      }

      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(
      0,
      0,
      gameState.mapSize.width * constants.wireframeTileSize.width,
      gameState.mapSize.height * constants.wireframeTileSize.height
    );

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

    rays.forEach((ray) => {
      const radius = ray.len;

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ray.x = ray.light.position.x * constants.wireframeTileSize.width;
      ray.y = ray.light.position.y * constants.wireframeTileSize.height;

      ctx.setTransform(1, 0, 0, 1, ray.x, ray.y);
      ctx.beginPath();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = ray.gradient;

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 360) {
        ray.setDirection(angle);

        ray.len = radius;
        ray.cast(gameState.buildings);
        ray.pathEnd();
        ray.draw();
      }
    });

    ctx.fill();

    //
    gameState.getAllAliveUnitsArray().forEach((unit) => {
      unit.calcShadows(gameState.lights);
    });
  }, [rays, gameState.lights, gameState.debug.featureEnabled.light, gameState.debug.featureEnabled.unitShadow]);

  return <Canvas size={gameState.mapSize} className={"shadows"} ref={canvasRef} />;
});
