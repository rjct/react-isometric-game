import React from "react";
import { useGameState } from "../useGameState";
import { constants } from "../../constants";
import { useCanvas } from "../useCanvas";
import { LightRay } from "../../engine/LightRayFactory";

export function useDebugVisualization(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState, uiState } = useGameState();
  const { clearCanvas, drawFillRect } = useCanvas();

  const allAliveUnits = React.useMemo(
    () => gameState.getAllAliveUnitsArray().filter((unit) => gameState.isEntityVisible(unit)),
    [gameState.getAllAliveUnitsHash()]
  );

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

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

      renderOccupiedCells();
      renderUnitPath();
      renderUnitFieldOfView();
      renderTargetVector();
      renderShadowVectors();
    }
  };

  const renderOccupiedCells = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.occupiedCells) return;

    for (const building of gameState.buildings) {
      if (building.occupiesCell) {
        drawFillRect(ctx, building.position, building.internalColor, 1, building.size.grid);
      }
    }

    for (const unit of allAliveUnits) {
      drawFillRect(ctx, unit.getRoundedPosition(), unit.internalColor, 1, unit.size.grid);
    }
  };

  const renderUnitPath = () => {
    const ctx = getCtx();

    if (!ctx || !gameState.debug.featureEnabled.unitPath) return;

    ctx.setLineDash([15, 5]);

    for (const unit of allAliveUnits) {
      if (unit.path.length > 0) {
        const x = unit.position.x * wireframeTileWidth + wireframeTileWidth / 2;
        const y = unit.position.y * wireframeTileHeight + wireframeTileHeight / 2;
        const color = unit.isHero ? "orange" : "limegreen";

        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);

        const path = unit.pathQueue.points.slice();
        path.shift();

        for (const pathPoint of path) {
          ctx.lineTo(
            pathPoint.x * wireframeTileWidth + wireframeTileWidth / 2,
            pathPoint.y * wireframeTileHeight + wireframeTileHeight / 2
          );
        }

        ctx.fillStyle = color;
        ctx.fillRect(
          unit.pathQueue.destinationPos.x * wireframeTileWidth + wireframeTileWidth / 2 - 10,
          unit.pathQueue.destinationPos.y * wireframeTileHeight + wireframeTileHeight / 2 - 10,
          20,
          20
        );
        ctx.stroke();
      }
    }
  };

  const renderUnitFieldOfView = () => {
    const ctx = getCtx();

    if (
      !ctx ||
      ((uiState.scene === "game" || uiState.scene === "combat") && !gameState.debug.featureEnabled.unitFieldOfView) ||
      (uiState.scene === "editor" &&
        (uiState.editorMode !== "units" || !gameState.debug.featureEnabled.unitFieldOfView))
    )
      return;

    ctx.setLineDash([0, 0]);

    for (const unit of allAliveUnits) {
      if (unit.distanceToHero > unit.fieldOfView.range) {
        continue;
      }

      for (const ray of unit.fieldOfView.rays) {
        ray.setColor(ray.collidedWithEntity?.id === gameState.heroId ? "rgba(255,0,0,0.5)" : "rgba(0,255,0,0.5)");

        LightRay.draw(ctx, ray.getRayData(), false);
      }
    }
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    for (const unit of allAliveUnits) {
      for (const shadow of unit.shadows) {
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
      }
    }
  };

  return { renderDebugVisualization };
}
