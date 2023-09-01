import { GameMap } from "@src/engine/GameMap";
import { floor, getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints } from "@src/engine/helpers";

export class ObstacleRay {
  public readonly from: GridCoordinates;
  public readonly to: GridCoordinates;
  public vector: GridCoordinates[] = [];
  constructor(from: GridCoordinates, to: GridCoordinates, precision = false) {
    this.from = precision ? { ...from } : { x: floor(from.x), y: floor(from.y) };
    this.to = precision ? { ...to } : { x: floor(to.x), y: floor(to.y) };

    this.cast();
  }

  getDistance(precision = false) {
    const distance = getDistanceBetweenGridPoints(this.from, this.to);

    return precision ? distance : floor(distance);
  }

  getDistanceToRayEndPosition(gameMap: GameMap, precision = false) {
    const distance = getDistanceBetweenGridPoints(this.from, this.getRayEndPosition(gameMap));

    return precision ? distance : floor(distance);
  }

  getAngle() {
    return getAngleBetweenTwoGridPoints(this.from, this.to);
  }

  getRayEndPosition(gameMap: GameMap): GridCoordinates {
    const targetPosition = { ...this.to };

    for (const cell of this.vector) {
      if (gameMap.isCellOccupied(cell)) {
        targetPosition.x = Math.round(cell.x);
        targetPosition.y = Math.round(cell.y);
      }
    }

    return targetPosition;
  }

  private cast() {
    const result: GridCoordinates[] = [];

    let x1 = floor(this.from.x);
    let y1 = floor(this.from.y);
    const x2 = floor(this.to.x);
    const y2 = floor(this.to.y);

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
