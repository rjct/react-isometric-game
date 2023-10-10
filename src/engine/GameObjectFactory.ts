import { StaticMapInventory, StaticMapWeapon, StaticMapWeaponAmmo } from "@src/context/GameStateContext";
import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponName } from "@src/dict/weapon/weapon";
import { Building } from "@src/engine/BuildingFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { getEntityZIndex, gridToScreenSpace, randomUUID } from "@src/engine/helpers";
import { LightRay } from "@src/engine/light/LightRayFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { createAmmoByName, createWeaponByName, itemIsWeapon } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type GameObjectIntersectionWithLightRay = {
  wall: GameObjectWall;
  x: number;
  y: number;
  param: number;
  angle: number;
};

export class GameObject {
  public readonly gameState: GameMap;

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

  public inventory: {
    main: Array<Weapon | Ammo>;
    leftHand: Weapon | null;
    rightHand: Weapon | null;
  } = {
    main: [],
    leftHand: null,
    rightHand: null,
  };

  private readonly explorable: boolean = false;

  constructor(props: {
    gameState: GameMap;
    id?: string;
    size: { grid: Size3D; screen: Size2D };
    position: GridCoordinates;
    direction: Direction;
    internalColor: string;
    occupiesCell?: boolean;
    explorable?: boolean;
  }) {
    this.gameState = props.gameState;

    this.id = props.id || randomUUID();
    this.internalColor = props.internalColor;

    this.size = props.size;
    this.position = props.position;
    this.zIndex = getEntityZIndex(this);
    this.direction = props.direction;

    if (props.occupiesCell === false) {
      this.occupiesCell = false;
    }

    if (props.explorable) {
      this.explorable = true;
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

    this.walls.forEach((wall) => {
      wall.setPosition(this.position, wall.area.local);
    });
  }

  getRoundedPosition(): GridCoordinates {
    return {
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
    };
  }

  rayDist(lightRay: LightRay, wall: GameObjectWall) {
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

  isExplorable() {
    return this.explorable;
  }

  getAvailableDirections(): Direction[] {
    return ["left", "top", "right", "bottom"];
  }

  getAllUnblockedCellsAroundEntity() {
    const cells: GridCoordinates[] = [];

    for (let x = this.position.x - 1; x < this.position.x + this.size.grid.width + 1; x++) {
      for (let y = this.position.y - 1; y < this.position.y + this.size.grid.length + 1; y++) {
        if (!this.gameState.isCellOccupied({ x, y })) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  getInventoryItems(inventoryType?: keyof GameObject["inventory"]) {
    if (inventoryType) {
      return [this.inventory[inventoryType] || []].flat();
    }

    const leftHand = this.inventory.leftHand ? [this.inventory.leftHand] : [];
    const rightHand = this.inventory.rightHand ? [this.inventory.rightHand] : [];
    const main = this.inventory.main;

    return [...leftHand, ...rightHand, ...main];
  }

  getInventoryItemsGrouped(inventoryType?: keyof GameObject["inventory"]) {
    const items = this.getInventoryItems(inventoryType);

    return items.reduce(
      (group, item) => {
        const { name } = item;

        group[name] = group[name] ?? [];
        group[name].push(item);

        return group;
      },
      {} as { [p: WeaponName | AmmoName]: Array<Weapon | Ammo> },
    );
  }

  getInventoryItemsWeight(inventoryType?: keyof GameObject["inventory"]) {
    const items = this.getInventoryItems(inventoryType);

    return Math.round(items.reduce((prevValue, item) => prevValue + item.dictEntity.weight, 0));
  }

  public putItemToInventory(item: Weapon | Ammo, inventoryType: keyof GameObject["inventory"]) {
    if (inventoryType === "main" || !itemIsWeapon(item)) {
      this.inventory.main.push(item);
    } else {
      this.inventory[inventoryType] = item;
    }
  }

  createInventoryItem(inventoryType: keyof StaticMapInventory, staticMapItem: StaticMapWeapon | StaticMapWeaponAmmo) {
    switch (staticMapItem.class) {
      case "weapon":
        const weapon = createWeaponByName(staticMapItem.name, this.gameState);

        this.putItemToInventory(weapon, inventoryType);

        return [weapon];

      case "ammo":
        const ammo = Array.from({ length: staticMapItem.quantity }, () =>
          createAmmoByName(staticMapItem.name, this.gameState),
        );

        ammo.forEach((iter) => {
          this.putItemToInventory(iter, inventoryType);
        });

        return ammo;
    }
  }

  createInventory(inventory: StaticMapInventory, owner: Building | Unit) {
    if (!inventory) return;

    Object.entries(inventory).forEach(([inventoryType, staticEntity]) => {
      if (Array.isArray(staticEntity)) {
        staticEntity.forEach((iter) => {
          this.createInventoryItem(inventoryType as keyof StaticMapInventory, iter).forEach((item) => {
            item.assignOwner(owner);
          });
        });
      } else {
        this.createInventoryItem(inventoryType as keyof StaticMapInventory, staticEntity).forEach((item) => {
          item.assignOwner(owner);
        });
      }
    });
  }

  getHash() {
    return `${this.position.x}:${this.position.y}:${this.direction}:${this.occupiesCell}`;
  }
}

export class GameObjectWall {
  public readonly gameObject: GameObject;
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
  constructor(gameObject: GameObject, area: AreaCoordinates) {
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
