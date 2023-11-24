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
    return gameState.getAliveEnemiesArray().filter((enemy) => gameState.isEntityVisibleByHero(enemy));
  }, [gameState.getAllAliveUnitsHash()]);

  const buildings = React.useMemo(() => {
    return [...gameState.buildings, ...gameState.vehicles];
  }, [hero.getHash(), gameState.settings.featureEnabled.fogOfWar]);

  const renderMiniMap = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
    // clear
    ctx.fillStyle = "rgba(0, 0, 0, 1)";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const mapCenter = {
      x: miniMapWidth / 2 - hero.position.grid.x,
      y: miniMapHeight / 2 - hero.position.grid.y,
    };

    const heroCoordinates = getCoordinates({
      x: hero.position.grid.x + mapCenter.x,
      y: hero.position.grid.y + mapCenter.y,
    });

    // map rect
    const mapRect = getCoordinates({
      x: mapCenter.x,
      y: mapCenter.y,
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = "lime";
    ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
    ctx.strokeRect(
      mapRect.x + 0.5,
      mapRect.y + 0.5,
      gameState.mapSize.width * wireframeTileWidth * miniMapZoom,
      gameState.mapSize.height * wireframeTileHeight * miniMapZoom,
    );
    ctx.fillRect(
      mapRect.x + 0.5,
      mapRect.y + 0.5,
      gameState.mapSize.width * wireframeTileWidth * miniMapZoom,
      gameState.mapSize.height * wireframeTileHeight * miniMapZoom,
    );

    //
    ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";

    ctx.beginPath();
    ctx.moveTo(
      heroCoordinates.x + (wireframeTileWidth / 2) * miniMapZoom,
      heroCoordinates.y + (wireframeTileHeight / 2) * miniMapZoom,
    );

    for (const ray of hero.fieldOfView.rays) {
      const rayCoordinates = getCoordinates({
        x:
          Math.max(
            Math.min(Math.round(ray.n.grid.x * ray.len.grid) + ray.position.grid.x, gameState.mapSize.width),
            0,
          ) + mapCenter.x,
        y:
          Math.max(
            Math.min(Math.round(ray.n.grid.y * ray.len.grid) + ray.position.grid.y, gameState.mapSize.height),
            0,
          ) + mapCenter.y,
      });

      ctx.lineTo(rayCoordinates.x, rayCoordinates.y);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // enemies
    allAliveEnemies.forEach((enemy) => {
      const enemyCoordinates = getCoordinates({
        x: enemy.position.grid.x + mapCenter.x,
        y: enemy.position.grid.y + mapCenter.y,
      });

      ctx.fillStyle = "#ff3333";
      ctx.fillRect(
        enemyCoordinates.x,
        enemyCoordinates.y,
        wireframeTileWidth * miniMapZoom,
        wireframeTileHeight * miniMapZoom,
      );
    });

    // buildings
    for (const building of buildings) {
      if (!building.blocksRays) continue;

      const buildingCoordinates = getCoordinates({
        x: building.position.grid.x + mapCenter.x,
        y: building.position.grid.y + mapCenter.y,
      });

      ctx.fillStyle = gameState.isEntityVisibleByHero(building) ? building.internalColor : "rgba(255,255,255,0.3)";

      ctx.fillRect(
        buildingCoordinates.x,
        buildingCoordinates.y,
        building.size.grid.width * wireframeTileWidth * miniMapZoom,
        building.size.grid.length * wireframeTileHeight * miniMapZoom,
      );
    }

    // hero pin
    ctx.fillStyle = "white";
    ctx.fillRect(
      heroCoordinates.x,
      heroCoordinates.y,
      wireframeTileWidth * miniMapZoom,
      wireframeTileHeight * miniMapZoom,
    );
  };

  return { renderMiniMap };
}
