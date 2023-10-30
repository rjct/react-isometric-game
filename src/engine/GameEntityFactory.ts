import { StaticMapInventory, StaticMapWeapon, StaticMapWeaponAmmo } from "@src/context/GameStateContext";
import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponName } from "@src/dict/weapon/weapon";
import { Building } from "@src/engine/BuildingFactory";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { degToRad, getEntityZIndex, gridToScreenSpace, randomUUID } from "@src/engine/helpers";
import { LightRay } from "@src/engine/light/LightRayFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { calculateSizeAfterRotation, createInventoryItemByName, itemIsWeapon } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type GameEntityIntersectionWithLightRay = {
  wall: GameEntityWall;
  x: number;
  y: number;
  param: number;
  angle: number;
};

export type InventoryType = keyof GameEntity["inventory"];

export interface GameEntityProps {
  gameState: GameMap;
  id?: string;
  size: { grid: Size3D; screen: Size2D };
  position: GridCoordinates;
  rotation: AngleInDegrees;
  internalColor: string;
  occupiesCell?: boolean;
  blocksRays: boolean;
  explorable?: boolean;
}

export class GameEntity {
  public readonly gameState: GameMap;

  public readonly id;
  public readonly internalColor: string;

  public size: {
    grid: Size3D;
    screen: Size2D;
  };
  public position: {
    grid: GridCoordinates;
    screen: ScreenCoordinates;
    iso: ScreenCoordinates;
  } = {
    grid: { x: 0, y: 0 },
    screen: { x: 0, y: 0 },
    iso: { x: 0, y: 0 },
  };
  public zIndex: number;
  public rotation: Angle = {
    deg: 0,
    rad: 0,
  };
  public occupiesCell = true;
  public blocksRays = true;

  public walls: GameEntityWall[] = [];

  public inventory: {
    main: Array<Weapon | Ammo>;
    leftHand?: Weapon | null;
    rightHand?: Weapon | null;
  } = {
    main: [],
  };

  private readonly explorable: boolean = false;

  constructor(props: GameEntityProps) {
    this.gameState = props.gameState;

    this.id = props.id || randomUUID();
    this.internalColor = props.internalColor;

    this.rotation = {
      deg: props.rotation,
      rad: degToRad(props.rotation),
    };

    this.size = {
      grid: calculateSizeAfterRotation(props.size.grid, this.rotation),
      screen: props.size.screen,
    };

    this.zIndex = getEntityZIndex(this);

    if (props.occupiesCell === false) {
      this.occupiesCell = false;
    }

    if (props.blocksRays === false) {
      this.blocksRays = false;
    }

    if (props.explorable) {
      this.explorable = true;
    }

    this.createWalls();
  }

  createWalls() {
    this.walls = [
      // top
      new GameEntityWall(this, {
        x1: 0,
        y1: 0,
        x2: this.size.grid.width,
        y2: 0,
      }),

      // right
      new GameEntityWall(this, {
        x1: this.size.grid.width,
        y1: 0,
        x2: this.size.grid.width,
        y2: this.size.grid.length,
      }),

      // bottom
      new GameEntityWall(this, {
        x1: this.size.grid.width,
        y1: this.size.grid.length,
        x2: 0,
        y2: this.size.grid.length,
      }),

      // left
      new GameEntityWall(this, {
        x1: 0,
        y1: this.size.grid.length,
        x2: 0,
        y2: 0,
      }),
    ];
  }

  setPosition(position: GridCoordinates, gameState: GameMap) {
    this.position = {
      grid: position,
      screen: gridToScreenSpace(position, gameState.mapSize),
      iso: { x: position.x * constants.wireframeTileSize.width, y: position.y * constants.wireframeTileSize.height },
    };

    this.zIndex = getEntityZIndex(this);

    this.walls.forEach((wall) => {
      wall.setPosition(this.position.grid, wall.area.local);
    });
  }

  public setRotation(angle: Angle) {
    this.rotation = angle;
  }

  getRoundedPosition(): GridCoordinates {
    return {
      x: Math.round(this.position.grid.x),
      y: Math.round(this.position.grid.y),
    };
  }

  rayDist(lightRay: LightRay, wall: GameEntityWall) {
    const rWCross = lightRay.n.grid.x * wall.n.grid.y - lightRay.n.grid.y * wall.n.grid.x;

    if (!rWCross) {
      return Infinity;
    }

    const x = lightRay.position.grid.x - wall.position.grid.x; // vector from ray to wall start
    const y = lightRay.position.grid.y - wall.position.grid.y;

    let u = (lightRay.n.grid.x * y - lightRay.n.grid.y * x) / rWCross; // unit distance along normal of wall

    // does the ray hit the wall segment
    if (u < 0 || u > wall.len.grid) {
      return Infinity;
    }
    // no
    // as we use the wall normal and ray normal the unit distance is the same as the
    u = (wall.n.grid.x * y - wall.n.grid.y * x) / rWCross;

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

    return !u || u < 0 ? { distance: Infinity, entity: null } : { distance: u, entity: this }; // if behind ray return Infinity else the dist
  }

  isExplorable() {
    return this.explorable;
  }

  getAvailableRotationAngles(): AngleInDegrees[] {
    return [0, 90, 180, 270];
  }

  getAllUnblockedCellsAroundEntity() {
    const cells: GridCoordinates[] = [];

    for (let x = this.position.grid.x - 1; x < this.position.grid.x + this.size.grid.width + 1; x++) {
      for (let y = this.position.grid.y - 1; y < this.position.grid.y + this.size.grid.length + 1; y++) {
        if (!this.gameState.isCellOccupied({ x, y })) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  getInventoryItems(inventoryType?: keyof GameEntity["inventory"]) {
    if (inventoryType) {
      return [this.inventory[inventoryType] || []].flat();
    }

    const leftHand = this.inventory.leftHand ? [this.inventory.leftHand] : [];
    const rightHand = this.inventory.rightHand ? [this.inventory.rightHand] : [];
    const main = this.inventory.main;

    return [...leftHand, ...rightHand, ...main];
  }

  getInventoryItemsGrouped(inventoryType?: keyof GameEntity["inventory"]) {
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

  getInventoryItemsWeight(inventoryType?: keyof GameEntity["inventory"]) {
    const items = this.getInventoryItems(inventoryType);

    return Math.round(items.reduce((prevValue, item) => prevValue + item.dictEntity.weight, 0));
  }

  public putItemToInventory(item: Weapon | Ammo, inventoryType: keyof GameEntity["inventory"]) {
    if (inventoryType === "main" || !itemIsWeapon(item)) {
      this.inventory.main.push(item);
    } else {
      this.inventory[inventoryType] = item;
    }
  }

  createInventoryItem(inventoryType: keyof StaticMapInventory, staticMapItem: StaticMapWeapon | StaticMapWeaponAmmo) {
    const inventoryItem = Array.from({ length: staticMapItem.quantity || 1 }, () =>
      createInventoryItemByName(staticMapItem.name, this.gameState),
    );

    inventoryItem.forEach((iter) => {
      this.putItemToInventory(iter, inventoryType);
    });

    return inventoryItem;
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

  getInventoryMainJSON(): (StaticMapWeapon | StaticMapWeaponAmmo)[] {
    const backpackItems = this.inventory.main.reduce(
      (acc, item) => {
        const { name } = item;

        const newItem: StaticMapWeapon | StaticMapWeaponAmmo = {
          class: item.class,
          name,
          quantity: acc[name] ? (acc[name].quantity || 0) + 1 : 1,
        };

        return {
          ...acc,
          [name]: newItem,
        };
      },
      {} as { [id: string]: StaticMapWeapon | StaticMapWeaponAmmo },
    );

    Object.values(backpackItems).forEach((iter) => {
      if (iter.quantity === 1) delete iter.quantity;
    });

    return Object.values(backpackItems);
  }

  getInventoryHandJSON(inventoryType: "leftHand" | "rightHand") {
    return {
      class: this.inventory[inventoryType]!.class,
      name: this.inventory[inventoryType]!.name,
    } as StaticMapWeapon;
  }

  getHash() {
    return `${this.position.grid.x}:${this.position.grid.y}:${this.rotation.deg}:${this.occupiesCell}`;
  }
}

export class GameEntityWall {
  public readonly gameEntity: GameEntity;
  public area = {
    local: { x1: 0, y1: 0, x2: 0, y2: 0 } as AreaCoordinates,
    world: { x1: 0, y1: 0, x2: 0, y2: 0 } as AreaCoordinates,
  };
  position: {
    grid: GridCoordinates;
    screen: ScreenCoordinates;
  } = {
    grid: { x: 0, y: 0 },
    screen: { x: 0, y: 0 },
  };

  size: {
    grid: Size2D;
    screen: Size2D;
  } = {
    grid: { width: 0, height: 0 },
    screen: { width: 0, height: 0 },
  };

  len: {
    grid: number;
    screen: number;
  };

  n: {
    grid: { x: number; y: number };
    screen: { x: number; y: number };
  };

  constructor(gameEntity: GameEntity, area: AreaCoordinates) {
    this.gameEntity = gameEntity;

    this.setPosition(gameEntity.position.grid, area);

    this.size = {
      grid: {
        width: area.x2 - area.x1,
        height: area.y2 - area.y1,
      },
      screen: {
        width: (area.x2 - area.x1) * constants.wireframeTileSize.width,
        height: (area.y2 - area.y1) * constants.wireframeTileSize.height,
      },
    };

    this.len = {
      grid: Math.hypot(this.size.grid.width, this.size.grid.height),
      screen: Math.hypot(this.size.screen.width, this.size.screen.height),
    };

    this.n = {
      grid: {
        x: this.size.grid.width / this.len.grid,
        y: this.size.grid.height / this.len.grid,
      },
      screen: {
        x: this.size.screen.width / this.len.screen,
        y: this.size.screen.height / this.len.screen,
      },
    };
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

    this.position = {
      grid: {
        x: this.area.world.x1,
        y: this.area.world.y1,
      },
      screen: {
        x: this.area.world.x1 * constants.wireframeTileSize.width,
        y: this.area.world.y1 * constants.wireframeTileSize.height,
      },
    };
  }

  public getIntersectionWithRay = (ray: {
    from: GridCoordinates;
    to: GridCoordinates;
  }): GameEntityIntersectionWithLightRay | null => {
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
