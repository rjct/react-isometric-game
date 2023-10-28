import { GameEntity, GameEntityProps } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";
import { convertPathToCoordinatesArray } from "@src/engine/unit/pathFinder";

export class MovableGameEntity extends GameEntity {
  public path: GridCoordinates[] = [];
  public pathQueue: PathQueue;
  public pathCompleteCallback: (() => void) | null = null;

  private collisionDetected = false;

  constructor(props: GameEntityProps) {
    super(props);

    this.pathQueue = new PathQueue();
  }

  public setPath(path: number[][]) {
    this.path = convertPathToCoordinatesArray(path);
  }

  public setPathCompleteCallback(callback: (() => void) | null) {
    this.pathCompleteCallback = callback;
  }

  public setPositionComplete() {
    if (this.pathCompleteCallback) {
      this.pathCompleteCallback();
    }
  }

  public convertCoordinatesToPathArray(coordinates: GridCoordinates[]) {
    return coordinates.map((iter) => [iter.x, iter.y]);
  }

  public clearPath() {
    this.pathQueue.points = [];
    this.path = [];
  }

  public setPosition(position: GridCoordinates, gameState: GameMap) {
    super.setPosition(position, gameState);

    this.collisionDetected = gameState.checkCollision(this);
  }

  public isCollisionDetected() {
    return this.collisionDetected;
  }
}

class PathQueue {
  points: GridCoordinates[];
  currentPos: GridCoordinates;
  destinationPos: GridCoordinates;
  distAlong: number;
  totalDistMoved: number;
  atEnd: boolean;

  constructor() {
    this.points = [];
    this.currentPos = { x: 0, y: 0 };
    this.destinationPos = { x: 0, y: 0 };
    this.distAlong = 0;
    this.totalDistMoved = 0;
    this.atEnd = false;
  }

  moveAlong(deltaTime: number) {
    if (deltaTime > 0) {
      if (this.points.length > 1) {
        const x = this.points[1].x - this.points[0].x;
        const y = this.points[1].y - this.points[0].y;
        const len = Math.sqrt(x * x + y * y);

        if (len - this.distAlong < deltaTime) {
          const lastPoint = this.points.shift();

          deltaTime -= len - this.distAlong;
          this.totalDistMoved += len - this.distAlong;
          this.distAlong = 0;

          return lastPoint;
        }

        const frac = (this.distAlong + deltaTime) / len;
        this.currentPos.x = this.points[0].x + x * frac;
        this.currentPos.y = this.points[0].y + y * frac;
        this.distAlong += deltaTime;
        this.totalDistMoved += deltaTime;
      } else {
        this.currentPos.x = this.points[0].x;
        this.currentPos.y = this.points[0].y;
        this.distAlong = 0;
        this.points = [];
        this.atEnd = true;
      }
    }
  }
}
