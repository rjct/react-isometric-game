import { StaticMapBuilding, StaticMapWeapon } from "@src/context/GameStateContext";
import buildings from "@src/dict/buildings.json";
import { GameMap } from "@src/engine/gameMap";
import { GameObjectFactory } from "@src/engine/GameObjectFactory";

import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { createAmmoByClassName, createWeaponByClassName } from "@src/engine/weapon/helpers";
import { Weapon, WeaponClass, WeaponType } from "@src/engine/weapon/WeaponFactory";

type BuildingSize = {
  grid: Size3D;
  screen: Size2D;
};

export type BuildingType = keyof typeof buildings;

export type BuildingClass = "wall" | "vehicle" | "furniture";

export interface DictBuilding {
  class: BuildingClass;
  type: keyof typeof buildings;
  className: string;
  size: BuildingSize;
  directions: Direction[];
  variants: number;
  internalColor: string;
  inventory?: Weapon[];
}

export type DictBuildings = {
  [buildingType in BuildingType]: DictBuilding;
};

export class Building extends GameObjectFactory {
  public readonly class;
  public readonly type;

  public readonly className;
  public readonly variants;
  variant = 0;

  private readonly ref: DictBuilding;
  public inventory = {
    main: [] as Weapon[],
  };

  constructor(props: {
    gameState: GameMap;
    buildingType: BuildingType;
    position: GridCoordinates;
    direction: Direction;
    variant: number;
    occupiesCell: boolean;
    inventory?: StaticMapWeapon[];
  }) {
    const ref = { ...buildings[props.buildingType] } as DictBuilding;
    const size = Building.getSizeByPositionAndDirection(ref.size, props.direction);

    super({
      gameState: props.gameState,
      size,
      position: props.position,
      direction: props.direction,
      internalColor: ref.internalColor,
    });

    this.ref = ref;

    this.class = ref.class;
    this.type = props.buildingType;
    this.className = ["building", this.ref.className].join(" ");

    this.variants = this.ref.variants;
    this.variant = props.variant;

    this.occupiesCell = props.occupiesCell;

    if (props.inventory) {
      this.inventory.main = props.inventory.map((staticWeapon) => {
        const weapon = createWeaponByClassName(staticWeapon.class as WeaponClass, staticWeapon.type as WeaponType);

        if (staticWeapon.ammo && weapon instanceof Firearm) {
          const ammo = staticWeapon.ammo;

          weapon.ammoCurrent = Array.from({ length: ammo.quantity }, () =>
            createAmmoByClassName(ammo.class, ammo?.type),
          );
        }

        weapon.assignOwner(this);

        this.gameState.weapon[weapon.id] = weapon;
        weapon.updateReferenceToGameMap(this.gameState);

        return weapon;
      });
    }
  }

  private static getSizeByPositionAndDirection(size: BuildingSize, direction: Direction) {
    return ["left", "right"].includes(direction)
      ? {
          ...size,
          ...{
            grid: { width: size.grid.length, length: size.grid.width, height: size.grid.height },
            //screen: { width: size.screen.height, height: size.screen.width },
          },
        }
      : size;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
    this.size = Building.getSizeByPositionAndDirection(this.ref.size, direction);
    this.createWalls();
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public getAvailableDirections() {
    return this.ref.directions;
  }

  public getInventoryItems() {
    return this.inventory.main;
  }

  public putItemToInventory(item: Weapon) {
    this.inventory.main.push(item);
  }

  public findInventoryEntityPlaceType(_entity: Weapon): keyof Building["inventory"] {
    return "main";
  }

  public removeItemFromInventory(item: Weapon) {
    const itemOnInventory = this.inventory.main.find((backpackItem) => backpackItem.id === item.id);

    if (itemOnInventory) {
      const index = this.inventory.main.findIndex((item) => item.id === itemOnInventory.id);
      this.inventory.main.splice(index, 1);
    }
  }

  public getInventoryItemById(itemId: string) {
    return this.getInventoryItems().find((item) => item?.id === itemId);
  }

  public isAllowedToPutItemInInventory() {
    return true;
  }

  public getJSON() {
    const json = {
      type: this.type,
      position: this.getRoundedPosition(),
      direction: this.direction,
      variant: this.variant,
    } as StaticMapBuilding;

    if (!this.occupiesCell) {
      json.occupiesCell = false;
    }

    if (this.inventory.main.length > 0) {
      json.inventory = this.inventory.main.map((item) => {
        return item.getJSON();
      });
    }

    return json;
  }
}

export type BuildingTypes = typeof buildings;
