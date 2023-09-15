import { constants } from "@src/constants";
import { StaticMap } from "@src/context/GameStateContext";
import { GameUI } from "@src/context/GameUIContext";
import { GameMap } from "@src/engine/GameMap";
import { GameObjectFactory } from "@src/engine/GameObjectFactory";
import { Unit } from "@src/engine/UnitFactory";

export const loadMap = async (mapUrl: string) => {
  const data = await fetch(`${constants.BASE_URL}/${mapUrl}`);
  const json: StaticMap = await data.json();

  return json;
};

export function randomInt(min: number, max: number) {
  return floor(Math.random() * (max - min + 1)) + min;
}

export function getHumanReadableDirection(angle: number): Unit["direction"] {
  switch (true) {
    case angle > 315 || angle < 45:
      return "left";

    case angle >= 45 && angle <= 135:
      return "top";

    case angle >= 135 && angle <= 225:
      return "right";

    case angle >= 225 && angle <= 315:
    default:
      return "bottom";
  }
}

export function getDirectionInDegFromString(direction: Direction) {
  switch (direction) {
    case "top":
      return 90;

    case "right":
      return 180;

    case "bottom":
      return 270;

    case "left":
      return 0;
  }
}

export function getEntityZIndex(entity: GameObjectFactory) {
  const { position, size } = entity;

  const x = Math.ceil(position.x + size.grid.width);
  const y = Math.ceil(position.y + size.grid.length / 2);

  return x + y + 1;
}

export function getCss3dPosition(position: GridCoordinates, useWorldSize = true, isIsometric = false) {
  const tileWidth = useWorldSize ? constants.wireframeTileSize.width : 1;
  const tileHeight = useWorldSize ? constants.wireframeTileSize.height : 1;

  const isometricTransform = isIsometric ? " rotateX(135deg) rotateY(135deg) rotateZ(150deg) translate(-5px, 8px)" : "";

  return `translate3d(${position.x * tileWidth}px, ${position.y * tileHeight}px, 0)${isometricTransform}`;
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

export function getVisibleIsometricGridCells(
  boundingBox: { x: number; y: number; width: number; height: number },
  mapSize: GameMap["mapSize"],
) {
  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;
  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;
  const cacheH = constants.OFFSCREEN_TILE_CACHE * tileWidth;
  const cacheV = constants.OFFSCREEN_TILE_CACHE * tileHeight;

  const visibleGridCells: GameUI["viewport"]["grid"] = {};

  for (let x = 0; x < mapSize.width; x++) {
    for (let y = 0; y < mapSize.height; y++) {
      const cellCenterX = (x - y) * halfWidth + (mapSize.width / 2 - 0.5) * tileWidth;
      const cellCenterY = (x + y) * halfHeight;

      if (
        cellCenterX >= boundingBox.x - cacheH &&
        cellCenterY >= boundingBox.y - cacheV &&
        cellCenterX < boundingBox.x + boundingBox.width + cacheH - tileWidth &&
        cellCenterY <= boundingBox.y + boundingBox.height + cacheV - tileHeight
      ) {
        visibleGridCells[`${x}:${y}`] = { x, y };
      }
    }
  }

  return visibleGridCells;
}

export function createMatrix(mapSize: Size2D): Array<Array<number>> {
  return [...Array(mapSize.width)].map(() => Array(mapSize.height).fill(0));
}

export function getDistanceBetweenGridPoints(startPosition: GridCoordinates, targetPosition: GridCoordinates) {
  const displacementX = targetPosition.x - startPosition.x;
  const displacementY = targetPosition.y - startPosition.y;

  return Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));
}

export function getAngleBetweenTwoGridPoints(startPosition: GridCoordinates, targetPosition: GridCoordinates) {
  const distance = {
    x: targetPosition.x - startPosition.x,
    y: targetPosition.y - startPosition.y,
  };

  const rad: number = Math.atan2(distance.y, distance.x);
  const deg = radToDeg(rad);

  return {
    rad,
    deg,
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
