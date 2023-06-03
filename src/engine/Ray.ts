import { getDistanceBetweenGridPoints } from "./helpers";
import { GameMap } from "./GameMap";

export class Ray {
  private readonly from: Coordinates;
  private readonly to: Coordinates;
  public vector: Coordinates[] = [];
  constructor(from: Coordinates, to: Coordinates) {
    this.from = { x: Math.floor(from.x), y: Math.floor(from.y) };
    this.to = { x: Math.floor(to.x), y: Math.floor(to.y) };

    this.cast();
  }

  getDistance() {
    return Math.floor(getDistanceBetweenGridPoints(this.from, this.to));
  }

  getDistanceToRayEndPosition(gameMap: GameMap) {
    return Math.floor(getDistanceBetweenGridPoints(this.from, this.getRayEndPosition(gameMap)));
  }

  getRayEndPosition(gameMap: GameMap): Coordinates {
    const targetPosition = { ...this.to };

    // for (let i = 0; i < this.vector.length; i++) {
    //   const cell = this.vector[i];
    //
    //   if (gameMap.isCellOccupied(cell)) {
    //     targetPosition.x = Math.round(cell.x);
    //     targetPosition.y = Math.round(cell.y);
    //
    //     break;
    //   }
    // }
    this.vector.forEach((cell) => {
      if (gameMap.isCellOccupied(cell)) {
        targetPosition.x = Math.round(cell.x);
        targetPosition.y = Math.round(cell.y);
      }
    });

    return targetPosition;
  }

  private cast() {
    const result: Coordinates[] = [];

    let x1 = this.from.x;
    let y1 = this.from.y;
    const x2 = this.to.x;
    const y2 = this.to.y;

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
