import { Unit } from "./UnitFactory";
import { Building } from "./BuildingFactory";
import { constants } from "../constants";
import { StaticMap } from "../context/GameStateContext";

export const loadMap = async (mapUrl: string) => {
  const data = await fetch(`${constants.BASE_URL}/${mapUrl}`);
  const json: StaticMap = await data.json();

  return json;
};

/**
 * @param {number} angleInDegrees is the amount of direction in radians
 * @param {number} ox X of the origin (center of direction)
 * @param {number} oy Y of the origin (center of direction)
 * @param {number} x X of the top left of the rectangle
 * @param {number} y Y of the top left of the rectangle
 * @param {number} w width of the rectangle
 * @param {number} h height of the rectangle
 */
export function rotateRect(angleInDegrees: number, ox: number, oy: number, x: number, y: number, w: number, h: number) {
  const angleInRadians = angleInDegrees * (Math.PI / 180);

  const xAx = Math.cos(angleInRadians);
  const xAy = Math.sin(angleInRadians);

  x -= ox;
  y -= oy;

  return {
    tl: {
      x: x * xAx - y * xAy + ox,
      y: x * xAy + y * xAx + oy,
    },
    tr: {
      x: (x + w) * xAx - y * xAy + ox,
      y: (x + w) * xAy + y * xAx + oy,
    },
    br: {
      x: (x + w) * xAx - (y + h) * xAy + ox,
      y: (x + w) * xAy + (y + h) * xAx + oy,
    },
    bl: {
      x: x * xAx - (y + h) * xAy + ox,
      y: x * xAy + (y + h) * xAx + oy,
    },
  };
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getHumanReadableDirection(angle: number): Unit["direction"] {
  switch (true) {
    case angle >= 135:
    case angle <= -135:
      return "left";

    case angle > -45 && angle < 45:
      return "right";

    case angle > 45 && angle < 135:
      return "bottom";

    case angle > -135 && angle < -45:
      return "top";
  }

  return "right";
}

export function getEntityZIndex(unit: Unit | Building) {
  const { position, size } = unit;

  const x = Math.ceil(position.x + size.grid.width);
  const y = Math.ceil(position.y + size.grid.height / 2);

  return x + y + 1;
}

export function createMatrix(mapSize: Size): Array<Array<number>> {
  return [...Array(mapSize.width)].map(() => Array(mapSize.height).fill(0));
}

export function getDistanceBetweenGridPoints(startPosition: Coordinates, targetPosition: Coordinates) {
  const displacementX = targetPosition.x - startPosition.x;
  const displacementY = targetPosition.y - startPosition.y;

  return Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));
}

export function radToDeg(radians: number) {
  return radians * (180 / Math.PI);
}

export function composeSpriteUrl(spriteFileName: string) {
  return constants.SPRITE_URL.replace("%SPRITE_FILE_NAME%", spriteFileName);
}
