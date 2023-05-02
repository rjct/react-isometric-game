import { constants } from "../constants";
import React from "react";
import { useGameState } from "./useGameState";

export function useFogOfWar(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState } = useGameState();

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const tileWidth = constants.wireframeTileSize.width;
  const tileHeight = constants.wireframeTileSize.height;

  const clearFogOfWar = () => {
    if (props.canvasRef.current) {
      const ctx = props.canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);
    }
  };

  const renderFogOfWar = () => {
    if (props.canvasRef.current) {
      const ctx = props.canvasRef.current.getContext("2d");
      if (!ctx) return;

      const hideFill = "rgba( 0, 0, 0, .7 )";
      const r2 = wireframeTileWidth * constants.FOG_OF_WAR_RADIUS + wireframeTileWidth * 2;
      const r1 = r2 / 3;

      ctx.globalCompositeOperation = "source-over";
      clearFogOfWar();
      ctx.fillStyle = hideFill;
      ctx.fillRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);

      for (let y = 0; y < gameState.fogOfWarMatrix.length; y++) {
        for (let x = 0; x < gameState.fogOfWarMatrix[y].length; x++) {
          const x2 = x * tileWidth + tileWidth;
          const y2 = y * tileHeight + tileHeight;

          if (gameState.isCellVisited(x, y)) {
            const radGrd = ctx.createRadialGradient(x2, y2, r1, x2, y2, r2);
            radGrd.addColorStop(0, "rgba( 0, 0, 0,  1 )");
            radGrd.addColorStop(0.8, "rgba( 0, 0, 0, .1 )");
            radGrd.addColorStop(1, "rgba( 0, 0, 0,  0 )");

            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "#ffffff";
            ctx.fillStyle = radGrd;

            ctx.fillRect(x2 - r2, y2 - r2, r2 * 2, r2 * 2);
          }
        }
      }
    }
  };

  return { renderFogOfWar, clearFogOfWar };
}
