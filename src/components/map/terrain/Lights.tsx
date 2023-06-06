import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { Canvas } from "../../_shared/Canvas";
import { constants } from "../../../constants";

export const Lights = React.memo(() => {
  const { gameState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;
  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      const hideFill = "rgba(0,13,35,0.85)";

      ctx.clearRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = hideFill;
      ctx.fillRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);

      ctx.lineWidth = 0;
      ctx.globalAlpha = 0.9;

      gameState.lights.forEach((light) => {
        const x = light.position.x * wireframeTileWidth + wireframeTileWidth / 2;
        const y = light.position.y * wireframeTileHeight + wireframeTileHeight / 2;
        const radius = light.radius * wireframeTileWidth;

        const gradient = ctx.createRadialGradient(x, y, radius / 2, x, y, radius);
        gradient.addColorStop(0, light.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
      });
    }

    gameState.getAllAliveUnitsArray().forEach((unit) => {
      unit.calcShadows(gameState.lights);
    });
  }, [
    JSON.stringify(gameState.lights),
    //Object.values(gameState.units).length,
    canvasRef.current,
    gameState.debug.featureEnabled.lights,
  ]);

  return gameState.debug.featureEnabled.lights ? (
    <Canvas size={gameState.mapSize} className={"lights"} ref={canvasRef} />
  ) : null;
});
