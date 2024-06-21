import { StaticMap } from "@src/context/GameStateContext";
import { GameUI } from "@src/context/GameUIContext";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { Building } from "@src/engine/building/BuildingFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export const loadMap = async (mapUrl: string) => {
  const data = await fetch(`${constants.BASE_URL}/${mapUrl}`);
  const json: StaticMap = await data.json();

  return json;
};

export function randomInt(min: number, max: number) {
  return floor(Math.random() * (max - min + 1)) + min;
}

export function getEntityZIndex(entity: GameEntity | Light) {
  const { position, size } = entity;

  const x = Math.ceil(position.grid.x + size.grid.width);
  const y = Math.ceil(position.grid.y + size.grid.length / 2);

  return x + y + 1;
}

export function getCss3dPosition(position: GridCoordinates, useWorldSize = true, isIsometric = false) {
  const tileWidth = useWorldSize ? constants.wireframeTileSize.width : 1;
  const tileHeight = useWorldSize ? constants.wireframeTileSize.height : 1;

  const isometricTransform = isIsometric ? " rotateX(135deg) rotateY(135deg) rotateZ(150deg) translate(-5px, 8px)" : "";

  return `translate3d(${Math.round(position.x * tileWidth)}px, ${Math.round(
    position.y * tileHeight,
  )}px, 0)${isometricTransform}`;
}

export function gridToScreenSpace(gridPos: GridCoordinates, mapSize: Size2D): ScreenCoordinates {
  const mapWidth = mapSize.width;

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;

  const x = (gridPos.x - gridPos.y) * halfWidth + (mapWidth / 2 - 0.5) * tileWidth;
  const y = (gridPos.x + gridPos.y) * halfHeight;

  return { x, y };
}

export function screenToGridSpace(screenPos: GridCoordinates, mapSize: Size2D): GridCoordinates {
  const mapWidth = mapSize.width;
  const mapHeight = mapSize.height;

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;

  const x = 0.5 * ((screenPos.x - (mapWidth / 2 - 0.5) * tileWidth) / halfWidth + screenPos.y / halfHeight);
  const y = 0.5 * (-(screenPos.x - (mapHeight / 2 - 0.5) * tileWidth) / halfWidth + screenPos.y / halfHeight);

  return { x, y };
}

export function getVisibleIsometricGridCells(
  boundingBox: { x: number; y: number; width: number; height: number },
  mapSize: GameMap["mapSize"],
  offscreenTileCacheSize = constants.OFFSCREEN_TILE_CACHE,
) {
  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;
  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;
  const cacheH = offscreenTileCacheSize * tileWidth;
  const cacheV = offscreenTileCacheSize * tileHeight;

  const visibleGridCells: GameUI["viewport"]["visibleCells"] = {};

  let x1 = mapSize.width;
  let y1 = mapSize.height;
  let x2 = 0;
  let y2 = 0;

  for (let x = 0; x < mapSize.width; x++) {
    for (let y = 0; y < mapSize.height; y++) {
      const cellCenterX = (x - y) * halfWidth + (mapSize.width / 2 - 0.5) * tileWidth;
      const cellCenterY = (x + y) * halfHeight;

      if (
        cellCenterX >= boundingBox.x - cacheH &&
        cellCenterY >= boundingBox.y - cacheV &&
        cellCenterX <= boundingBox.x + boundingBox.width + cacheH - tileWidth &&
        cellCenterY <= boundingBox.y + boundingBox.height + cacheV - tileHeight
      ) {
        x1 = Math.min(x1, x);
        y1 = Math.min(y1, y);
        x2 = Math.max(x2, x);
        y2 = Math.max(y2, y);

        visibleGridCells[`${x}:${y}`] = { x, y };
      }
    }
  }

  return { grid: { x1, y1, x2, y2 }, visibleCells: visibleGridCells };
}

export function createMatrix(mapSize: Size2D): Array<Array<number>> {
  return [...Array(mapSize.width)].map(() => Array(mapSize.height).fill(0));
}

export function getDistanceBetweenGridPoints(startPosition: GridCoordinates, targetPosition: GridCoordinates) {
  const displacementX = targetPosition.x - startPosition.x;
  const displacementY = targetPosition.y - startPosition.y;

  return Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));
}

export function getDistanceBetweenEntities(
  entity1: Unit | Building | Vehicle,
  entity2: Unit | Building | Vehicle,
): number {
  const entity1Corners = [
    { x: entity1.position.grid.x, y: entity1.position.grid.y },
    { x: entity1.position.grid.x + entity1.size.grid.width, y: entity1.position.grid.y },
    { x: entity1.position.grid.x, y: entity1.position.grid.y + entity1.size.grid.length },
    { x: entity1.position.grid.x + entity1.size.grid.width, y: entity1.position.grid.y + entity1.size.grid.length },
  ];

  const entity2Corners = [
    { x: entity2.position.grid.x, y: entity2.position.grid.y },
    { x: entity2.position.grid.x + entity2.size.grid.width, y: entity2.position.grid.y },
    { x: entity2.position.grid.x, y: entity2.position.grid.y + entity2.size.grid.length },
    { x: entity2.position.grid.x + entity2.size.grid.width, y: entity2.position.grid.y + entity2.size.grid.length },
  ];

  let minDistance = Number.MAX_VALUE;

  for (const corner1 of entity1Corners) {
    for (const corner2 of entity2Corners) {
      const distance = Math.sqrt(Math.pow(corner1.x - corner2.x, 2) + Math.pow(corner1.y - corner2.y, 2));

      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  }

  return minDistance;
}

export function getAngleBetweenTwoGridPoints(
  startPosition: GridCoordinates,
  targetPosition: GridCoordinates,
  compensateRotation = true,
  additionalRotationInDegree = 0,
) {
  const distance = {
    x: targetPosition.x - startPosition.x,
    y: targetPosition.y - startPosition.y,
  };

  const compensationAngle = compensateRotation ? degToRad(90) : 0;

  const rad: number = Math.atan2(distance.y, distance.x) - compensationAngle + degToRad(additionalRotationInDegree);
  const deg = radToDeg(rad);

  return {
    rad,
    deg,
  };
}

export function calculateIsometricAngle(coordinates1: GridCoordinates, coordinates2: GridCoordinates): Angle {
  const isoX1 = coordinates1.x - coordinates1.y;
  const isoY1 = coordinates1.x + coordinates1.y;
  const isoX2 = coordinates2.x - coordinates2.y;
  const isoY2 = coordinates2.x + coordinates2.y;

  const deltaX = isoX2 - isoX1;
  const deltaY = isoY2 - isoY1;

  const angleInRadians = Math.atan2(deltaY, deltaX) - degToRad(45);
  const angleInDegrees = radToDeg(angleInRadians);

  return {
    deg: angleInDegrees,
    rad: angleInRadians,
  };
}

export function radToDeg(radians: number) {
  let degree = radians * (180 / Math.PI);
  if (degree < 0) degree = 180 + (180 - Math.abs(degree));
  return degree;
}

export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function normalizeAngle(angle: Angle) {
  angle.deg = ((angle.deg % 360) + 360) % 360; // Normalize degrees using modulo
  angle.rad = (angle.deg * Math.PI) / 180; // Convert degrees to radians

  return angle;
}

export function composeSpriteUrl(spriteFileName: string) {
  return constants.SPRITE_URL.replace("%SPRITE_FILE_NAME%", spriteFileName);
}

export function floor(num: number) {
  return num | 0;
}

export function randomUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function gridToScreesSize(size: Size2D): Size2D {
  return {
    width: size.width * constants.wireframeTileSize.width,
    height: size.height * constants.wireframeTileSize.height,
  };
}

export function getCellsInVector(
  grid: GameMap["matrix"],
  from: GridCoordinates,
  to: GridCoordinates,
): GridCoordinates[] {
  const cellsInVector: GridCoordinates[] = [];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  for (let i = 0; i <= steps; i++) {
    const x = Math.round(from.x + (i * dx) / steps);
    const y = Math.round(from.y + (i * dy) / steps);

    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
      cellsInVector.push({ x, y });
    }
  }

  return cellsInVector;
}

export function generateNumbersWithStep(max: number, step: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= max; i += step) {
    result.push(i);
  }
  return result;
}

export function darkenLightenColor(color: string, percent: number): string {
  const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);

  if (!isValidColor) {
    throw new Error(`Invalid color format (${color}). Please use a hexadecimal color.`);
  }

  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);

  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
