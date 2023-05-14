import React from "react";
import { useGameState } from "./useGameState";
import { constants } from "../constants";
import { useHero } from "./useHero";
import { Unit } from "../engine/UnitFactory";

export function usePathVisualization(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const isCirclesColliding = (unit1: Unit, unit2: Unit) => {
    const a = Math.abs(unit1.position.x - unit2.position.x);
    const b = Math.abs(unit1.position.y - unit2.position.y);

    const distance = Math.sqrt(a * a + b * b);

    return distance < unit1.enemyDetectionRange + 0.5;
  };

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
          ctx.strokeStyle = isCirclesColliding(unit, hero) ? "red" : "#cccccc";
          ctx.arc(x, y, unit.enemyDetectionRange * wireframeTileHeight, 0, 2 * Math.PI);
          ctx.stroke();

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
