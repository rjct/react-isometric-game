import { constants } from "../constants";
import { LightRay } from "./LightRayFactory";
import { getEntityZIndex, gridToScreenSpace } from "./helpers";

export type GameObjectWall = {
  x: number;
  y: number;
  width: number;
  height: number;
  len: number;
  nx: number;
  ny: number;
};

export class GameObjectFactory {
  public readonly id;

  public size = { grid: { width: 0, height: 0 }, screen: { width: 0, height: 0 } };
  public position: GridCoordinates = { x: 0, y: 0 };
  public screenPosition: ScreenCoordinates = { x: 0, y: 0 };
  public zIndex: number;
  public direction: Direction = "top";

  private readonly walls: GameObjectWall[] = [];

  constructor(props: { size: { grid: Size; screen: Size }; position: GridCoordinates; direction: Direction }) {
    this.id = crypto.randomUUID();

    this.size = props.size;
    this.position = props.position;
    this.zIndex = getEntityZIndex(this);
    this.direction = props.direction;

    this.walls = [
      this.createWall({
        x1: 0,
        y1: 0,
        x2: this.size.grid.width,
        y2: 0,
      }),
      this.createWall({
        x1: this.size.grid.width,
        y1: 0,
        x2: this.size.grid.width,
        y2: this.size.grid.height,
      }),
      this.createWall({
        x1: this.size.grid.width,
        y1: this.size.grid.height,
        x2: 0,
        y2: this.size.grid.height,
      }),
      this.createWall({
        x1: 0,
        y1: this.size.grid.height,
        x2: 0,
        y2: 0,
      }),
    ];
  }

  setPosition(position: GridCoordinates, mapSize: Size) {
    this.position = position;
    this.screenPosition = gridToScreenSpace(position, mapSize);
    this.zIndex = getEntityZIndex(this);
  }

  getRoundedPosition(): GridCoordinates {
    return {
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
    };
  }

  private createWall(area: AreaCoordinates): GameObjectWall {
    const tileWidth = constants.wireframeTileSize.width;
    const tileHeight = constants.wireframeTileSize.height;

    const x = (this.position.x + area.x1) * tileWidth;
    const y = (this.position.y + area.y1) * tileHeight;
    const width = (area.x2 - area.x1) * tileWidth;
    const height = (area.y2 - area.y1) * tileHeight;
    const len = Math.hypot(width, height);
    const nx = width / len;
    const ny = height / len;

    return {
      x,
      y,
      width,
      height,
      len,
      nx,
      ny,
    };
  }

  public rayDist(lightRay: LightRay, wall: GameObjectWall) {
    const rWCross = lightRay.nx * wall.ny - lightRay.ny * wall.nx;

    if (!rWCross) {
      return Infinity;
    }

    const x = lightRay.x - wall.x; // vector from ray to wall start
    const y = lightRay.y - wall.y;

    let u = (lightRay.nx * y - lightRay.ny * x) / rWCross; // unit distance along normal of wall

    // does the ray hit the wall segment
    if (u < 0 || u > wall.len) {
      return Infinity;
    }
    // no
    // as we use the wall normal and ray normal the unit distance is the same as the
    u = (wall.nx * y - wall.ny * x) / rWCross;

    return u < 0 ? Infinity : u; // if behind ray return Infinity else the dist
  }

  rayDist2Polygon(lightRay: LightRay) {
    let u, lineU;

    for (let i = 0; i < this.walls.length; i++) {
      lineU = this.rayDist(lightRay, this.walls[i]);

      if (!u) {
        // If it's the first hit, assign it to `u`
        u = lineU;
      } else if (lineU < u) {
        // If the current hit is smaller than anything we have so far, then this is the closest one, assign it to `u`
        u = lineU;
      }
    }

    return !u || u < 0 ? Infinity : u; // if behind ray return Infinity else the dist
  }

  getHash() {
    return `${this.position.x}:${this.position.y}:${this.direction}`;
  }
}
