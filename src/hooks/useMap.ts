import { Building } from "@src/engine/building/BuildingFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { darkenLightenColor } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export function useMap(gameState: GameMap) {
  const { hero } = useHero();

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const getCoordinates = React.useCallback((coordinates: GridCoordinates, miniMapZoom: number) => {
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

  const entities = [...allAliveEnemies, ...[hero], ...buildings].sort((a, b) => a.zIndex - b.zIndex);

  const renderMiniMap = (
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    miniMapZoom: number,
    mapSize: Size2D = constants.miniMap.size,
  ) => {
    const canvasWidth = mapSize.width;
    const canvasHeight = mapSize.height;

    // clear
    ctx.fillStyle = "rgba(0, 0, 0, 0)";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const mapCenter = {
      x: mapSize.width / (wireframeTileWidth * miniMapZoom) / 2 - hero.position.grid.x,
      y: mapSize.height / (wireframeTileHeight * miniMapZoom) / 2 - hero.position.grid.y,
    };

    const heroCoordinates = getCoordinates(
      {
        x: hero.position.grid.x + mapCenter.x,
        y: hero.position.grid.y + mapCenter.y,
      },
      miniMapZoom,
    );

    // map rect
    const mapRect = getCoordinates(
      {
        x: mapCenter.x,
        y: mapCenter.y,
      },
      miniMapZoom,
    );

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
    ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
    ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";

    ctx.beginPath();
    ctx.moveTo(
      heroCoordinates.x + (wireframeTileWidth / 2) * miniMapZoom,
      heroCoordinates.y + (wireframeTileHeight / 2) * miniMapZoom,
    );

    for (const ray of hero.fieldOfView.rays) {
      const rayCoordinates = getCoordinates(
        {
          x: Math.round(ray.n.grid.x * ray.len.grid) + ray.position.grid.x + mapCenter.x,
          y: Math.round(ray.n.grid.y * ray.len.grid) + ray.position.grid.y + mapCenter.y,
        },
        miniMapZoom,
      );

      ctx.lineTo(rayCoordinates.x, rayCoordinates.y);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // enemies
    allAliveEnemies.forEach((enemy) => {
      const enemyCoordinates = getCoordinates(
        {
          x: enemy.position.grid.x + mapCenter.x,
          y: enemy.position.grid.y + mapCenter.y,
        },
        miniMapZoom,
      );

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

      const buildingCoordinates = getCoordinates(
        {
          x: building.position.grid.x + mapCenter.x,
          y: building.position.grid.y + mapCenter.y,
        },
        miniMapZoom,
      );

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

  function renderMap(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    miniMapZoom: number,
    mapSize: Size2D = constants.miniMap.size,
    offset: ScreenCoordinates = { x: 0, y: 0 },
  ) {
    const canvasWidth = mapSize.width;
    const canvasHeight = mapSize.height;

    // clear
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    function isoTransform(x: number, y: number, z: number): { x: number; y: number } {
      const isoX = (x - y) * Math.cos(Math.PI / 6);
      const isoY = (x + y) * Math.sin(Math.PI / 6) - z;

      return { x: isoX + canvasWidth / 2, y: isoY + canvasHeight / 4 };
    }

    function renderBox(entity: Building | Unit | Vehicle) {
      const x = entity.position.grid.x * wireframeTileWidth * miniMapZoom;
      const y = entity.position.grid.y * wireframeTileHeight * miniMapZoom;
      const z = 0;

      const width = entity.size.grid.width * wireframeTileWidth * miniMapZoom;
      const length = entity.size.grid.length * wireframeTileHeight * miniMapZoom;
      const height = entity.size.grid.height * wireframeTileHeight * miniMapZoom;

      const frontTopRight = isoTransform(x + width, y, z);
      const frontBottomLeft = isoTransform(x, y + length, z);
      const frontBottomRight = isoTransform(x + width, y + length, z);

      const backTopLeft = isoTransform(x, y, z + height);
      const backTopRight = isoTransform(x + width, y, z + height);
      const backBottomLeft = isoTransform(x, y + length, z + height);
      const backBottomRight = isoTransform(x + width, y + length, z + height);

      const baseColor = gameState.isEntityVisibleByHero(entity) ? entity.internalColor : "#ffffff";

      const colors = {
        right: darkenLightenColor(baseColor, -25),
        top: baseColor,
        bottom: darkenLightenColor(baseColor, 25),
      };

      // Draw top face
      ctx.fillStyle = colors.top;
      ctx.beginPath();
      ctx.moveTo(backTopLeft.x, backTopLeft.y);
      ctx.lineTo(backTopRight.x, backTopRight.y);
      ctx.lineTo(backBottomRight.x, backBottomRight.y);
      ctx.lineTo(backBottomLeft.x, backBottomLeft.y);
      ctx.closePath();
      ctx.fill();

      // Draw right face
      ctx.fillStyle = colors.right;
      ctx.beginPath();
      ctx.moveTo(frontTopRight.x, frontTopRight.y);
      ctx.lineTo(backTopRight.x, backTopRight.y);
      ctx.lineTo(backBottomRight.x, backBottomRight.y);
      ctx.lineTo(frontBottomRight.x, frontBottomRight.y);
      ctx.closePath();
      ctx.fill();

      // Draw bottom face
      ctx.fillStyle = colors.bottom;
      ctx.beginPath();
      ctx.moveTo(frontBottomLeft.x, frontBottomLeft.y);
      ctx.lineTo(frontBottomRight.x, frontBottomRight.y);
      ctx.lineTo(backBottomRight.x, backBottomRight.y);
      ctx.lineTo(backBottomLeft.x, backBottomLeft.y);
      ctx.closePath();
      ctx.fill();
    }

    function renderCone(entity: Building | Unit | Vehicle) {
      const colors = {
        right: darkenLightenColor(entity.internalColor, -25),
        top: entity.internalColor,
        bottom: darkenLightenColor(entity.internalColor, 25),
      };

      const x = entity.position.grid.x * wireframeTileWidth * miniMapZoom;
      const y = entity.position.grid.y * wireframeTileHeight * miniMapZoom;

      const width = entity.size.grid.width * wireframeTileWidth * miniMapZoom;
      const length = entity.size.grid.length * wireframeTileHeight * miniMapZoom;
      const height = entity.size.grid.height * wireframeTileHeight * miniMapZoom;

      const topRight = isoTransform(x + width, y, 0);
      const bottomLeft = isoTransform(x, y + length, 0);
      const bottomRight = isoTransform(x + width, y + length, 0);

      const top = isoTransform(x + width / 2, y + length / 2, height);

      ctx.fillStyle = colors.right;
      ctx.beginPath();
      ctx.moveTo(bottomRight.x, bottomRight.y);
      ctx.lineTo(top.x, top.y);
      ctx.lineTo(topRight.x, topRight.y);
      ctx.fill();

      ctx.fillStyle = colors.top;
      ctx.beginPath();
      ctx.moveTo(bottomLeft.x, bottomLeft.y);
      ctx.lineTo(top.x, top.y);
      ctx.lineTo(bottomRight.x, bottomRight.y);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(canvasWidth / 2 + offset.x, canvasHeight / 2 + offset.y);

    // map
    ctx.lineWidth = 1;
    ctx.strokeStyle = "lime";
    ctx.fillStyle = "rgba(0, 255, 0, 0.1)";

    const mapTopLeft = isoTransform(0, 0, 0);
    const mapTopRight = isoTransform(gameState.mapSize.width * wireframeTileWidth * miniMapZoom, 0, 0);
    const mapBottomRight = isoTransform(
      gameState.mapSize.width * wireframeTileWidth * miniMapZoom,
      gameState.mapSize.height * wireframeTileHeight * miniMapZoom,
      0,
    );
    const mapBottomLeft = isoTransform(0, gameState.mapSize.height * wireframeTileHeight * miniMapZoom, 0);

    ctx.beginPath();
    ctx.moveTo(mapTopLeft.x, mapTopLeft.y);
    ctx.lineTo(mapTopRight.x, mapTopRight.y);
    ctx.lineTo(mapBottomRight.x, mapBottomRight.y);
    ctx.lineTo(mapBottomLeft.x, mapBottomLeft.y);
    ctx.lineTo(mapTopLeft.x, mapTopLeft.y);
    ctx.stroke();
    ctx.fill();

    //
    for (const entity of entities) {
      //if (!entity.blocksRays) continue;

      switch (true) {
        case entity instanceof Unit:
          renderCone(entity);
          break;

        default:
          renderBox(entity);
      }
    }

    ctx.restore();
  }

  return { renderMiniMap, renderMap };
}
