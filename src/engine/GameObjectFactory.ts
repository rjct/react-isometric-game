import { constants } from "../constants";
import { LightRay } from "./LightRayFactory";
import { getEntityZIndex, gridToScreenSpace, randomUUID } from "./helpers";
import { GameMap } from "./GameMap";

export type GameObjectIntersectionWithLightRay = {
  wall: GameObjectWall;
  x: number;
  y: number;
  param: number;
  angle: number;
};

export class GameObjectFactory {
  public readonly id;
  public readonly internalColor: string;

  public size = { grid: { width: 0, length: 0, height: 0 }, screen: { width: 0, height: 0 } };
  public position: GridCoordinates = { x: 0, y: 0 };
  public screenPosition: { screen: ScreenCoordinates; iso: ScreenCoordinates } = {
    screen: { x: 0, y: 0 },
    iso: { x: 0, y: 0 },
  };
  public zIndex: number;
  public direction: Direction = "top";
  public occupiesCell = true;

  public walls: GameObjectWall[] = [];

  constructor(props: {
    id?: string;
    size: { grid: Size3D; screen: Size2D };
    position: GridCoordinates;
    direction: Direction;
    internalColor: string;
    occupiesCell?: boolean;
  }) {
    this.id = props.id || randomUUID();
    this.internalColor = props.internalColor;

    this.size = props.size;
    this.position = props.position;
    this.zIndex = getEntityZIndex(this);
    this.direction = props.direction;

    if (props.occupiesCell === false) {
      this.occupiesCell = false;
    }

    this.createWalls();
  }

  createWalls() {
    this.walls = [
      // top
      new GameObjectWall(this, {
        x1: 0,
        y1: 0,
        x2: this.size.grid.width,
        y2: 0,
      }),

      // right
      new GameObjectWall(this, {
        x1: this.size.grid.width,
        y1: 0,
        x2: this.size.grid.width,
        y2: this.size.grid.length,
      }),

      // bottom
      new GameObjectWall(this, {
        x1: this.size.grid.width,
        y1: this.size.grid.length,
        x2: 0,
        y2: this.size.grid.length,
      }),

      // left
      new GameObjectWall(this, {
        x1: 0,
        y1: this.size.grid.length,
        x2: 0,
        y2: 0,
      }),
    ];
  }

  setPosition(position: GridCoordinates, gameState: GameMap) {
    this.position = position;
    this.screenPosition = {
      screen: gridToScreenSpace(position, gameState.mapSize),
      iso: { x: position.x * constants.wireframeTileSize.width, y: position.y * constants.wireframeTileSize.height },
    };
    this.zIndex = getEntityZIndex(this);

    this.createWalls();
  }

  getRoundedPosition(): GridCoordinates {
    return {
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
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

    //return !u || u < 0 ? Infinity : u;
    return !u || u < 0 ? { distance: Infinity, entity: null } : { distance: u, entity: this }; // if behind ray return Infinity else the dist
  }

  getHash() {
    return `${this.position.x}:${this.position.y}:${this.direction}:${this.occupiesCell}`;
  }
}

export class GameObjectWall {
  public readonly gameObject: GameObjectFactory;
  public area = {
    local: { x1: 0, y1: 0, x2: 0, y2: 0 } as AreaCoordinates,
    world: { x1: 0, y1: 0, x2: 0, y2: 0 } as AreaCoordinates,
  };
  x = 0;
  y = 0;
  width: number;
  height: number;
  len: number;
  nx: number;
  ny: number;
  constructor(gameObject: GameObjectFactory, area: AreaCoordinates) {
    this.gameObject = gameObject;

    this.setPosition(gameObject.position, area);

    this.width = (area.x2 - area.x1) * constants.wireframeTileSize.width;
    this.height = (area.y2 - area.y1) * constants.wireframeTileSize.height;
    this.len = Math.hypot(this.width, this.height);
    this.nx = this.width / this.len;
    this.ny = this.height / this.len;
  }

  setPosition(position: GridCoordinates, area: AreaCoordinates) {
    this.area = {
      local: area,
      world: {
        x1: position.x + area.x1,
        y1: position.y + area.y1,
        x2: position.x + area.x2,
        y2: position.y + area.y2,
      },
    };

    this.x = this.area.world.x1 * constants.wireframeTileSize.width;
    this.y = this.area.world.y1 * constants.wireframeTileSize.height;
  }

  public getIntersectionWithRay = (ray: {
    from: GridCoordinates;
    to: GridCoordinates;
  }): GameObjectIntersectionWithLightRay | null => {
    const rDx = ray.to.x - ray.from.x;
    const rDy = ray.to.y - ray.from.y;

    const sPx = this.area.world.x1;
    const sPy = this.area.world.y1;
    const sDx = this.area.world.x2 - this.area.world.x1;
    const sDy = this.area.world.y2 - this.area.world.y1;

    const rMag = Math.sqrt(rDx * rDx + rDy * rDy);
    const sMag = Math.sqrt(sDx * sDx + sDy * sDy);

    if (rDx / rMag == sDx / sMag && rDy / rMag == sDy / sMag) {
      return null;
    }

    const T2 = (rDx * (sPy - ray.from.y) + rDy * (ray.from.x - sPx)) / (sDx * rDy - sDy * rDx);
    const T1 = (sPx + sDx * T2 - ray.from.x) / rDx;

    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    return {
      wall: this,
      x: ray.from.x + rDx * T1,
      y: ray.from.y + rDy * T1,
      param: T1,
      angle: 0,
    };
  };
}
