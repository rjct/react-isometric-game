import React from "react";
import { useGameState } from "./useGameState";
import { constants } from "../constants";

export function usePathVisualization(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState } = useGameState();

  const renderPathVisualization = () => {
    if (props.canvasRef.current) {
      const ctx = props.canvasRef.current.getContext("2d");
      if (!ctx) return;

      const mapWidth = gameState.mapSize.width;
      const mapHeight = gameState.mapSize.height;

      const wireframeTileWidth = constants.wireframeTileSize.width;
      const wireframeTileHeight = constants.wireframeTileSize.height;

      ctx.clearRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);

      gameState
        .getAllAliveUnitsArray()
        .filter((unit) => gameState.isEntityVisible(unit) && unit.path.length > 0)
        .forEach((unit) => {
          const x = unit.pathQueue.currentPos.x * wireframeTileWidth + wireframeTileWidth / 2;
          const y = unit.pathQueue.currentPos.y * wireframeTileHeight + wireframeTileHeight / 2;
          const color = unit.id === gameState.heroId ? "orange" : "limegreen";

          ctx.beginPath();
          ctx.setLineDash([15, 5]);
          ctx.moveTo(x, y);

          const path = unit.pathQueue.points.slice();
          path.shift();

          path.forEach((pathPoint) => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;

            ctx.lineTo(
              pathPoint.x * wireframeTileWidth + wireframeTileWidth / 2,
              pathPoint.y * wireframeTileHeight + wireframeTileHeight / 2
            );
          });

          ctx.fillStyle = color;
          ctx.fillRect(
            unit.pathQueue.destinationPos.x * wireframeTileWidth + wireframeTileWidth / 2 - 10,
            unit.pathQueue.destinationPos.y * wireframeTileHeight + wireframeTileHeight / 2 - 10,
            20,
            20
          );
          ctx.stroke();
        });
    }
  };

  return { renderPathVisualization };
}
