import { StaticMapBuilding } from "@src/context/GameStateContext";
import buildings from "@src/dict/buildings.json";
import { GameMap } from "@src/engine/gameMap";
import { GameObject } from "@src/engine/GameObjectFactory";

import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

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
  explorable?: boolean;
}

export class Building extends GameObject {
  public readonly dictEntity: DictBuilding;
  public readonly class;
  public readonly type;

  public readonly className;
  public readonly variants;
  variant = 0;

  constructor(props: {
    gameState: GameMap;
    buildingType: BuildingType;
    position: GridCoordinates;
    direction: Direction;
    variant: number;
    occupiesCell: boolean;
    inventory?: StaticMapBuilding["inventory"]; //Array<StaticMapWeapon | StaticMapWeaponAmmo>;
  }) {
    const ref = { ...buildings[props.buildingType] } as DictBuilding;
    const size = Building.getSizeByPositionAndDirection(ref.size, props.direction);

    super({
      gameState: props.gameState,
      size,
      position: props.position,
      direction: props.direction,
      internalColor: ref.internalColor,
      explorable: ref.explorable,
    });

    this.dictEntity = ref;

    this.class = ref.class;
    this.type = props.buildingType;
    this.className = ["building", this.dictEntity.className].join(" ");

    this.variants = this.dictEntity.variants;
    this.variant = props.variant;

    this.occupiesCell = props.occupiesCell;

    if (props.inventory) {
      this.createInventory(props.inventory, this);
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

  public setDirection(angle: Angle) {
    super.setDirection(angle);

    this.size = Building.getSizeByPositionAndDirection(this.dictEntity.size, this.direction);
    this.createWalls();
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public getAvailableDirections() {
    return this.dictEntity.directions;
  }

  public putItemToInventory(item: Weapon | Ammo) {
    this.inventory.main.push(item);
  }

  public findInventoryEntityPlaceType(): keyof Building["inventory"] {
    return "main";
  }

  public removeItemFromInventory(item: Weapon | Ammo) {
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

    if (this.inventory?.main.length > 0) {
      json.inventory = {
        main: super.getInventoryMainJSON(),
      };
    }

    return json;
  }
}

export type BuildingTypes = typeof buildings;
