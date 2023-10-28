import { StaticMapBuilding } from "@src/context/GameStateContext";
import buildings from "@src/dict/buildings.json";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";

import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { calculateSizeAfterRotation } from "@src/engine/weapon/helpers";
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
  rotationAngles: AngleInDegrees[];
  variants: number;
  internalColor: string;
  inventory?: Weapon[];
  explorable?: boolean;
}

export class Building extends GameEntity {
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
    rotation: AngleInDegrees;
    variant: number;
    occupiesCell: boolean;
    inventory?: StaticMapBuilding["inventory"]; //Array<StaticMapWeapon | StaticMapWeaponAmmo>;
  }) {
    const dictEntity = { ...buildings[props.buildingType] } as DictBuilding;

    super({
      gameState: props.gameState,
      size: dictEntity.size,
      position: props.position,
      rotation: props.rotation,
      internalColor: dictEntity.internalColor,
      explorable: dictEntity.explorable,
    });

    this.dictEntity = dictEntity;

    this.class = dictEntity.class;
    this.type = props.buildingType;
    this.className = ["building", this.dictEntity.className].join(" ");

    this.variants = this.dictEntity.variants;
    this.variant = props.variant;

    this.occupiesCell = props.occupiesCell;

    if (props.inventory) {
      this.createInventory(props.inventory, this);
    }
  }

  public setRotation(angle: Angle) {
    super.setRotation(angle);

    this.size = {
      grid: calculateSizeAfterRotation(this.dictEntity.size.grid, this.rotation),
      screen: { ...this.size.screen },
    };

    this.createWalls();
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public getAvailableRotationAngles() {
    return [...this.dictEntity.rotationAngles, 45, 135, 22];
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

  public isAllowedToPutItemInInventory() {
    return true;
  }

  public getInventoryItemById(itemId: string) {
    return this.getInventoryItems().find((item) => item?.id === itemId);
  }

  public getJSON() {
    const json = {
      type: this.type,
      position: this.getRoundedPosition(),
      rotation: this.rotation.deg,
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
