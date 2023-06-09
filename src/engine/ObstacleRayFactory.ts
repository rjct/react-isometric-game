import { getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "./helpers";
import { GameMap } from "./GameMap";

export class ObstacleRay {
  public readonly from: GridCoordinates;
  public readonly to: GridCoordinates;
  public vector: GridCoordinates[] = [];
  constructor(from: GridCoordinates, to: GridCoordinates, precision = false) {
    this.from = precision ? { ...from } : { x: Math.floor(from.x), y: Math.floor(from.y) };
    this.to = precision ? { ...to } : { x: Math.floor(to.x), y: Math.floor(to.y) };

    this.cast();
  }

  getDistance(precision = false) {
    const distance = getDistanceBetweenGridPoints(this.from, this.to);

    return precision ? distance : Math.floor(distance);
  }

  getDistanceToRayEndPosition(gameMap: GameMap, precision = false) {
    const distance = getDistanceBetweenGridPoints(this.from, this.getRayEndPosition(gameMap));

    return precision ? distance : Math.floor(distance);
  }

  getAngle() {
    return getAngleBetweenTwoGridPoints(this.from, this.to);
  }

  getRayEndPosition(gameMap: GameMap): GridCoordinates {
    const targetPosition = { ...this.to };

    this.vector.forEach((cell) => {
      if (gameMap.isCellOccupied(cell)) {
        targetPosition.x = Math.round(cell.x);
        targetPosition.y = Math.round(cell.y);
      }
    });

    return targetPosition;
  }

  private cast() {
    const result: GridCoordinates[] = [];

    let x1 = Math.floor(this.from.x);
    let y1 = Math.floor(this.from.y);
    const x2 = Math.floor(this.to.x);
    const y2 = Math.floor(this.to.y);

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let err = dx - dy;

    while (!(x1 == x2 && y1 == y2)) {
      const e2 = err << 1;

      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }

      result.push({ x: x1, y: y1 });
    }

    this.vector = result.reverse();
  }
}
