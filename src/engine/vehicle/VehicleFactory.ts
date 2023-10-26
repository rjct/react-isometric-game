import { StaticMapVehicle } from "@src/context/GameStateContext";
import { getVehicleDictEntityByType, VehicleDictEntity, VehicleType } from "@src/dict/vehicle/vehicle";
import { GameMap } from "@src/engine/gameMap";
import { GameObject } from "@src/engine/GameObjectFactory";
import { degToRad } from "@src/engine/helpers";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { calculateSizeAfterRotation, normalizeRotation } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class Vehicle extends GameObject {
  public readonly type: VehicleType;
  public readonly className: string;
  public readonly dictEntity: VehicleDictEntity;
  public realRotation: Angle;
  public action: "parked" | "idle" | "driving" = "parked";

  constructor(props: { gameState: GameMap; type: VehicleType; position: GridCoordinates; rotation: AngleInDegrees }) {
    const dictEntity = getVehicleDictEntityByType(props.type);

    super({
      gameState: props.gameState,
      size: dictEntity.size,
      position: props.position,
      rotation: props.rotation,
      internalColor: "rgba(0, 150, 0, 0.5)",
      explorable: true,
      occupiesCell: true,
    });

    this.dictEntity = dictEntity;

    this.type = props.type;
    this.className = ["vehicle", dictEntity.className].join(" ");

    this.realRotation = {
      deg: props.rotation,
      rad: degToRad(props.rotation),
    };
    this.setRotation(normalizeRotation(props.rotation, 32));
  }

  public setAction(action: Vehicle["action"]) {
    this.action = action;
  }

  public setRotation(angle: Angle) {
    this.realRotation = angle;
    super.setRotation(normalizeRotation(this.realRotation.deg, 32));

    this.size = {
      grid: calculateSizeAfterRotation(this.dictEntity.size.grid, this.rotation),
      screen: { ...this.size.screen },
    };

    this.createWalls();
  }

  public isAllowedToPutItemInInventory() {
    return true;
  }

  public findInventoryEntityPlaceType(): keyof Vehicle["inventory"] {
    return "main";
  }

  public removeItemFromInventory(item: Weapon | Ammo) {
    const itemOnInventory = this.inventory.main.find((backpackItem) => backpackItem.id === item.id);

    if (itemOnInventory) {
      const index = this.inventory.main.findIndex((item) => item.id === itemOnInventory.id);
      this.inventory.main.splice(index, 1);
    }
  }

  getJSON(): StaticMapVehicle {
    return {
      type: this.type,
      position: this.getRoundedPosition(),
      rotation: this.rotation.deg,
    };
  }
}
