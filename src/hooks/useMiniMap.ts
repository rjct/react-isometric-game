import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export function useMiniMap(gameState: GameMap) {
  const { hero } = useHero();

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const miniMapZoom = constants.miniMap.ZOOM;
  const miniMapWidth = constants.miniMap.size.width;
  const miniMapHeight = constants.miniMap.size.height;

  const canvasWidth = miniMapWidth * wireframeTileWidth * miniMapZoom;
  const canvasHeight = miniMapHeight * wireframeTileHeight * miniMapZoom;

  const getCoordinates = React.useCallback((coordinates: GridCoordinates) => {
    return {
      x: coordinates.x * wireframeTileWidth * miniMapZoom,
      y: coordinates.y * wireframeTileHeight * miniMapZoom,
    };
  }, []);

  const allAliveEnemies = React.useMemo(() => {
    return gameState.getAliveEnemiesArray().filter((enemy) => gameState.isEntityVisible(enemy));
  }, [gameState.getAllAliveUnitsHash()]);

  const buildings = React.useMemo(() => {
    return gameState.buildings.filter((building) => gameState.isEntityVisible(building));
  }, [hero.getHash(), gameState.settings.featureEnabled.fogOfWar]);

  const renderMiniMap = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
    // clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const mapCenter = {
      x: miniMapWidth / 2 - hero.position.grid.x,
      y: miniMapHeight / 2 - hero.position.grid.y,
    };

    // map rect
    const mapRect = getCoordinates({
      x: mapCenter.x,
      y: mapCenter.y,
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(
      mapRect.x + 0.5,
      mapRect.y + 0.5,
      gameState.mapSize.width * wireframeTileWidth * miniMapZoom,
      gameState.mapSize.height * wireframeTileHeight * miniMapZoom,
    );

    // hero pin
    ctx.fillStyle = "#ffffff";
    ctx.arc(
      canvasWidth / 2 + (wireframeTileWidth / 2) * miniMapZoom,
      canvasHeight / 2 + (wireframeTileWidth / 2) * miniMapZoom,
      (wireframeTileWidth / 2) * miniMapZoom,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    // enemies
    allAliveEnemies.forEach((enemy) => {
      const enemyCoordinates = getCoordinates({
        x: enemy.position.grid.x + mapCenter.x,
        y: enemy.position.grid.y + mapCenter.y,
      });

      ctx.fillStyle = "red";
      ctx.fillRect(
        enemyCoordinates.x,
        enemyCoordinates.y,
        wireframeTileWidth * miniMapZoom,
        wireframeTileHeight * miniMapZoom,
      );
    });

    // buildings
    buildings.forEach((building) => {
      const buildingCoordinates = getCoordinates({
        x: building.position.grid.x + mapCenter.x,
        y: building.position.grid.y + mapCenter.y,
      });

      ctx.fillStyle = building.internalColor;

      ctx.fillRect(
        buildingCoordinates.x,
        buildingCoordinates.y,
        building.size.grid.width * wireframeTileWidth * miniMapZoom,
        building.size.grid.length * wireframeTileHeight * miniMapZoom,
      );
    });
  };

  return { renderMiniMap };
}
