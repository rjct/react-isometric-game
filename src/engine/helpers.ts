import { Unit } from "./UnitFactory";
import { BuildingType } from "./BuildingFactory";
import { constants } from "../constants";
import { StaticMap } from "../context/GameStateContext";

export const loadMap = async (mapUrl: string) => {
  const data = await fetch(`${constants.BASE_URL}/${mapUrl}`);
  const json: StaticMap = await data.json();

  return json;
};

export function helperRotatePoint(point: Coordinates, angle: number) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  return {
    x: point.x * c - point.y * s,
    y: point.x * s + point.y * c,
  };
}

export type RectVertexCoordinates = {
  x: number;
  y: number;
};
export type RotatedRectCoordinates = {
  tl: RectVertexCoordinates;
  tr: RectVertexCoordinates;
  bl: RectVertexCoordinates;
  br: RectVertexCoordinates;
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

export function getUnitZIndex(unit: Unit | BuildingType) {
  const { position, size } = unit;

  const x = Math.ceil(position.x + size.grid.width);
  const y = Math.ceil(position.y + size.grid.height / 2);

  return x + y + 1;
}

export function createMatrix(mapSize: Size): Array<Array<number>> {
  return [...Array(mapSize.width)].map(() => Array(mapSize.height).fill(0));
}

export function cartesianToIsometric(coordinates: Coordinates) {
  return {
    x: ((coordinates.x - coordinates.y) * constants.wireframeTileSize.width) / 2,
    y: ((coordinates.x + coordinates.y) * constants.wireframeTileSize.height) / 2,
  };
}

export function getDistanceBetweenGridPoints(startPosition: Coordinates, targetPosition: Coordinates) {
  const displacementX = targetPosition.x - startPosition.x;
  const displacementY = targetPosition.y - startPosition.y;

  return Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));
}

export function radToDeg(radians: number) {
  return radians * (180 / Math.PI);
}

export function getWireframeTilePathDirection(
  prevCell: number[],
  currentCell: number[],
  nextCell: number[]
): TileProps["direction"] {
  if (!prevCell && !nextCell) return null;

  const [currentX, currentY] = currentCell;

  if (!prevCell) {
    switch (true) {
      case currentX < nextCell[0] && currentY === nextCell[1]:
        return "east-start";

      case currentX > nextCell[0] && currentY === nextCell[1]:
        return "west-start";

      case currentX === nextCell[0] && currentY > nextCell[1]:
        return "north-start";

      case currentX === nextCell[0] && currentY < nextCell[1]:
        return "south-start";
    }
  }

  if (!nextCell) {
    switch (true) {
      case currentX > prevCell[0] && currentY === prevCell[1]:
        return "east-finish";

      case currentX < prevCell[0] && currentY === prevCell[1]:
        return "west-finish";

      case currentX === prevCell[0] && currentY < prevCell[1]:
        return "north-finish";

      case currentX === prevCell[0] && currentY > prevCell[1]:
        return "south-finish";
    }
  }

  const [prevX, prevY] = prevCell;
  const [nextX, nextY] = nextCell;

  switch (true) {
    case currentX === prevX && currentX === nextX && currentY < prevY && currentY > nextY:
      return "north";

    case currentX === prevX && currentX === nextX && currentY > prevY && currentY < nextY:
      return "south";

    case currentX > prevX && currentX < nextX && currentY === prevY && currentY === nextY:
      return "east";

    case currentX < prevX && currentX > nextX && currentY === prevY && currentY === nextY:
      return "west";

    case currentX === prevX && currentX < nextX && currentY < prevY && currentY === nextY:
    case currentX < prevX && currentX === nextX && currentY === prevY && currentY < nextY:
      return "north-east";

    case currentX > prevX && currentX === nextX && currentY === prevY && currentY > nextY:
    case currentX === prevX && currentX > nextX && currentY > prevY && currentY === nextY:
      return "north-west";

    case currentX > prevX && currentX === nextX && currentY === prevY && currentY < nextY:
    case currentX === prevX && currentX > nextX && currentY < prevY && currentY === nextY:
      return "south-east";

    case currentX === prevX && currentX < nextX && currentY > prevY && currentY === nextY:
    case currentX < prevX && currentX === nextX && currentY === prevY && currentY > nextY:
      return "south-west";
  }

  return null;
}
