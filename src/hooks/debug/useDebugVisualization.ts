import { constants } from "@src/engine/constants";
import { degToRad } from "@src/engine/helpers";
import { useCanvas } from "@src/hooks/useCanvas";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function useDebugVisualization() {
  const { gameState, uiState } = useGameState();
  const { drawRect, drawFillRect, drawCircle } = useCanvas();
  const { getEditorLibraryPosition } = useEditor();

  const allAliveUnits = React.useMemo(
    () => gameState.getAllAliveUnitsArray().filter((unit) => gameState.isEntityVisibleByHero(unit)),
    [gameState.getAllAliveUnitsHash()],
  );

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const renderDebugVisualization = (ctx: CanvasRenderingContext2D) => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, uiState.viewport.screen.x2, uiState.viewport.screen.y2);

    ctx.setTransform(
      1,
      0,
      0,
      1,
      -uiState.scroll.x + (gameState.mapSize.width * constants.tileSize.width) / 2 + getEditorLibraryPosition(),
      -uiState.scroll.y,
    );
    ctx.scale(1, 0.5);
    ctx.rotate(degToRad(45));

    renderOccupiedCells(ctx);
    renderUnitFieldOfView(ctx);
    renderEntityMovementPath(ctx);
    renderTargetVector();
    renderShadowVectors(ctx);
  };

  const renderOccupiedCells = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.debug.featureEnabled.occupiedCells) return;

    for (const building of gameState.buildings) {
      if (building.occupiesCell && gameState.isEntityInViewport(building, uiState.viewport)) {
        drawFillRect(ctx, building.position.grid, building.internalColor, 1, building.size.grid);
      }
    }

    for (const vehicle of gameState.vehicles) {
      if (vehicle.occupiesCell && gameState.isEntityInViewport(vehicle, uiState.viewport)) {
        drawFillRect(ctx, vehicle.position.grid, vehicle.internalColor, 1, vehicle.size.grid);
      }
    }

    for (const unit of allAliveUnits) {
      if (gameState.isEntityInViewport(unit, uiState.viewport)) {
        drawCircle(ctx, unit.getRoundedPosition(), unit.internalColor, unit.internalColor, 0);
      }
    }

    //
    for (const cell in uiState.viewport.visibleCells) {
      if (gameState.isCellOccupied(uiState.viewport.visibleCells[cell])) {
        drawRect(ctx, uiState.viewport.visibleCells[cell], "rgba(255,255,255,2)", 2);
      }
    }
  };

  const renderEntityMovementPath = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.debug.featureEnabled.unitPath) return;

    ctx.setLineDash([15, 5]);

    const movableEntities = [...allAliveUnits, ...gameState.vehicles];

    for (const entity of movableEntities) {
      if (entity.path.length > 0) {
        const x = entity.position.grid.x * wireframeTileWidth + wireframeTileWidth / 2;
        const y = entity.position.grid.y * wireframeTileHeight + wireframeTileHeight / 2;
        const color = entity.internalColor;

        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);

        const path = entity.pathQueue.points.slice();
        path.shift();

        for (const pathPoint of path) {
          ctx.lineTo(
            pathPoint.x * wireframeTileWidth + wireframeTileWidth / 2,
            pathPoint.y * wireframeTileHeight + wireframeTileHeight / 2,
          );
        }

        ctx.fillStyle = color;
        ctx.fillRect(
          entity.pathQueue.destinationPos.x * wireframeTileWidth + wireframeTileWidth / 2 - 10,
          entity.pathQueue.destinationPos.y * wireframeTileHeight + wireframeTileHeight / 2 - 10,
          20,
          20,
        );
        ctx.stroke();
      }
    }
  };

  const renderUnitFieldOfView = (ctx: CanvasRenderingContext2D) => {
    if (
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

      ctx.fillStyle = "rgba(0,0,255,0.3)";

      unit.fieldOfView.cellsInView.forEach((cell) => {
        ctx.fillRect(
          cell.x * wireframeTileWidth,
          cell.y * wireframeTileHeight,
          wireframeTileWidth,
          wireframeTileHeight,
        );
      });

      const x = (unit.position.grid.x + 0.5) * wireframeTileWidth;
      const y = (unit.position.grid.y + 0.5) * wireframeTileHeight;

      const isHeroInView = unit.fieldOfView.rays.find((ray) => ray.collidedWithEntity?.id === gameState.heroId);

      ctx.lineWidth = 2;
      ctx.strokeStyle = isHeroInView ? "rgba(255,0,0,0.75)" : "rgba(0,255,0,0.75)";
      ctx.fillStyle = isHeroInView ? "rgba(255,0,0,0.35)" : "rgba(0,255,0,0.35)";

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (const ray of unit.fieldOfView.rays) {
        ctx.lineTo(
          Math.round(ray.n.screen.x * ray.len.screen) + ray.position.screen.x,
          Math.round(ray.n.screen.y * ray.len.screen) + ray.position.screen.y,
        );
      }

      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.moveTo(0, 0);
    }
  };

  const renderTargetVector = () => {
    // const ctx = getCtx();
    //
    // if (!ctx || !gameState.debug.featureEnabled.targetVector) return;
    //
    // gameState
    //   .getAllAliveUnitsArray()
    //   .filter((unit) => gameState.isEntityVisibleByHero(unit))
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

  const renderShadowVectors = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.debug.featureEnabled.unitShadowVectors) return;

    ctx.setLineDash([0, 0]);
    ctx.strokeStyle = "#FFE07D";

    for (const unit of allAliveUnits) {
      if (!gameState.isEntityInViewport(unit, uiState.viewport)) continue;

      for (const shadow of unit.shadows) {
        const x1 = unit.position.grid.x * wireframeTileWidth + wireframeTileWidth / 2;
        const y1 = unit.position.grid.y * wireframeTileHeight + wireframeTileHeight / 2;

        const x2 = shadow.light.position.grid.x * wireframeTileWidth + wireframeTileWidth / 2;
        const y2 = shadow.light.position.grid.y * wireframeTileHeight + wireframeTileHeight / 2;

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
