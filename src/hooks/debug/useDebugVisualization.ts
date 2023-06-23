import React from "react";
import { useGameState } from "../useGameState";
import { constants } from "../../constants";
import { useHero } from "../useHero";
import { Unit } from "../../engine/UnitFactory";
import { useCanvas } from "../useCanvas";

export function useDebugVisualization(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState } = useGameState();
  const { hero } = useHero();
  const { clearCanvas, drawLine, drawFillRect } = useCanvas();

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const isCirclesColliding = (unit1: Unit, unit2: Unit) => {
    const a = Math.abs(unit1.position.x - unit2.position.x);
    const b = Math.abs(unit1.position.y - unit2.position.y);

    const distance = Math.sqrt(a * a + b * b);

    return distance < unit1.enemyDetectionRange + 0.5;
  };

  const getCtx = () => {
    if (props.canvasRef?.current) {
      return props.canvasRef.current.getContext("2d");
    }

    return null;
  };

  const renderDebugVisualization = () => {
    if (props.canvasRef.current) {
      const ctx = getCtx();
      if (!ctx) return;

      clearCanvas(ctx);

      renderWireframe();
      renderOccupiedCells();
      renderUnitPath();
      renderEnemyDetectionRange();
      renderTargetVector();
      renderShadowVectors();
    }
  };

  const renderWireframe = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.wireframe) return;

    for (let column = 0; column <= gameState.mapSize.width; column++) {
      drawLine(ctx, { x: column, y: 0 }, { x: column, y: gameState.mapSize.height });
    }

    for (let row = 0; row <= gameState.mapSize.height; row++) {
      drawLine(ctx, { x: 0, y: row }, { x: gameState.mapSize.width, y: row });
    }
  };

  const renderOccupiedCells = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.occupiedCells) return;

    ctx.setLineDash([5, 5]);

    for (let y = 0; y < gameState.matrix.length; y++) {
      for (let x = 0; x < gameState.matrix[y].length; x++) {
        if (gameState.isCellOccupied({ x, y })) {
          drawFillRect(ctx, { x, y }, "rgba(255,232,0,0.5)");
        }
      }
    }
  };

  const renderUnitPath = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.unitPath) return;

    ctx.setLineDash([15, 5]);

    gameState
      .getAllAliveUnitsArray()
      .filter((unit) => gameState.isEntityVisible(unit))
      .forEach((unit) => {
        if (unit.path.length > 0) {
          const x = unit.position.x * wireframeTileWidth + wireframeTileWidth / 2;
          const y = unit.position.y * wireframeTileHeight + wireframeTileHeight / 2;
          const color = unit.id === gameState.heroId ? "orange" : "limegreen";

          ctx.lineWidth = 3;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(x, y);

          const path = unit.pathQueue.points.slice();
          path.shift();

          path.forEach((pathPoint) => {
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
        }
      });
  };

  const renderEnemyDetectionRange = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.enemyDetectionRange) return;

    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 3;

    gameState
      .getAllAliveUnitsArray()
      .filter((unit) => gameState.isEntityVisible(unit) && unit.id !== hero.id)
      .forEach((unit) => {
        const { x, y } = unit.position;

        ctx.beginPath();
        ctx.strokeStyle = isCirclesColliding(unit, hero) ? "red" : "#cccccc";
        ctx.arc(
          x * wireframeTileWidth + wireframeTileWidth / 2,
          y * wireframeTileHeight + wireframeTileHeight / 2,
          unit.enemyDetectionRange * wireframeTileHeight,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      });
  };

  const renderTargetVector = () => {
    // const ctx = getCtx();
    //
    // if (!ctx || !gameState.debug.featureEnabled.targetVector) return;
    //
    // gameState
    //   .getAllAliveUnitsArray()
    //   .filter((unit) => gameState.isEntityVisible(unit))
    //   .forEach((unit) => {
    //     //
    //     const weapon = unit.getCurrentWeapon();
    //
    //     if (weapon?.isAimed()) {
    //       const targetPosition = weapon.ray?.getRayEndPosition(gameState);
    //
    //       if (targetPosition) {
    //         ctx.beginPath();
    //         ctx.moveTo(
    //           unit.position.x * wireframeTileWidth + wireframeTileWidth / 2,
    //           unit.position.y * wireframeTileHeight + wireframeTileHeight / 2
    //         );
    //         ctx.lineTo(
    //           targetPosition.x * wireframeTileWidth + wireframeTileWidth / 2,
    //           targetPosition.y * wireframeTileHeight + wireframeTileHeight / 2
    //         );
    //         ctx.lineWidth = 5;
    //         ctx.strokeStyle = weapon?.isReadyToUse() ? "orange" : "darkgrey";
    //         ctx.stroke();
    //       }
    //     }
    //   });
  };

  const renderShadowVectors = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.unitShadowVectors) return;

    ctx.setLineDash([0, 0]);
    ctx.strokeStyle = "#FFE07D";

    gameState
      .getAllAliveUnitsArray()
      .filter((unit) => gameState.isEntityVisible(unit))
      .forEach((unit) => {
        unit.shadows.forEach((shadow) => {
          const x1 = shadow.obstacleRay.from.x * wireframeTileWidth + wireframeTileWidth / 2;
          const y1 = shadow.obstacleRay.from.y * wireframeTileHeight + wireframeTileHeight / 2;

          const x2 = shadow.obstacleRay.to.x * wireframeTileWidth + wireframeTileWidth / 2;
          const y2 = shadow.obstacleRay.to.y * wireframeTileHeight + wireframeTileHeight / 2;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);

          ctx.lineWidth = shadow.blocked ? 0.5 : 2;

          ctx.stroke();
          ctx.closePath();
        });
      });
  };

  return { renderDebugVisualization };
}
