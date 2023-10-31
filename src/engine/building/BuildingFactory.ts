import { StaticMapBuilding } from "@src/context/GameStateContext";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";

import getBuildingsDictList, { BuildingDictEntity, BuildingType } from "@src/dict/building/building";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { calculateSizeAfterRotation } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class Building extends GameEntity {
  public readonly dictEntity: BuildingDictEntity;
  public readonly class;
  public readonly type: BuildingType;

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
    inventory?: StaticMapBuilding["inventory"];
  }) {
    const dictEntity: BuildingDictEntity = { ...getBuildingsDictList()[props.buildingType] };

    super({
      gameState: props.gameState,
      size: dictEntity.size,
      position: props.position,
      rotation: props.rotation,
      internalColor: dictEntity.internalColor,
      occupiesCell: dictEntity.occupiesCell,
      blocksRays: dictEntity.blocksRays,
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
