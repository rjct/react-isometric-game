import { StaticMapVehicle } from "@src/context/GameStateContext";
import { getVehicleDictEntityByType, VehicleDictEntity, VehicleSfxType, VehicleType } from "@src/dict/vehicle/vehicle";
import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";
import { MovableGameEntity } from "@src/engine/MovableGameEntityFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { calculateSizeAfterRotation, normalizeRotation } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class Vehicle extends MovableGameEntity {
  public readonly type: VehicleType;
  public readonly className: string;
  public readonly dictEntity: VehicleDictEntity;
  public realRotation: Angle;
  public action: "none" | "idle" | "driving" = "none";
  public driver: Unit | null = null;

  public currentPlayingSfx: { [type in VehicleSfxType]?: AudioBufferSourceNode } = {};
  public speed: {
    current: number;
    max: number;
  };
  public accelerationEnabled = false;

  constructor(props: { gameState: GameMap; type: VehicleType; position: GridCoordinates; rotation: AngleInDegrees }) {
    const dictEntity = getVehicleDictEntityByType(props.type);

    super({
      gameState: props.gameState,
      size: dictEntity.size,
      position: props.position,
      rotation: props.rotation,
      internalColor: "rgba(0, 250, 0, 0.5)",
      explorable: true,
      occupiesCell: true,
    });

    this.dictEntity = dictEntity;

    this.type = props.type;
    this.className = ["vehicle", dictEntity.className].join(" ");

    this.speed = {
      current: 0,
      max: dictEntity.maxSpeed,
    };

    this.realRotation = {
      deg: props.rotation,
      rad: degToRad(props.rotation),
    };
    this.setRotation(normalizeRotation(props.rotation, 32));
  }

  public setAction(action: Vehicle["action"]) {
    this.action = action;
  }

  assignDriver(owner: Unit) {
    this.driver = owner;
    this.setDriverPosition();
    this.setAction("idle");
  }

  unAssignDriver() {
    this.driver = null;
    this.setAction("none");
  }

  public setRotation(angle: Angle) {
    this.realRotation = angle;

    const normalizedRotation = normalizeRotation(this.realRotation.deg, 32);

    super.setRotation(normalizedRotation);
    this.driver?.setRotation(normalizedRotation, false);

    this.size = {
      grid: calculateSizeAfterRotation(this.dictEntity.size.grid, this.rotation),
      screen: { ...this.size.screen },
    };

    this.createWalls();
  }

  public setPosition(position: GridCoordinates, gameState: GameMap) {
    this.setDriverPosition();

    super.setPosition(position, gameState);
  }

  public setDriverPosition() {
    this.driver?.setPosition(
      {
        x: this.position.grid.x + this.size.grid.width / 2,
        y: this.position.grid.y + this.size.grid.length / 2,
      },
      this.gameState,
    );

    this.driver?.setRotation(this.rotation);
  }

  public getCurrentSpeed() {
    return this.speed.current;
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

  public getHash(): string {
    const hash = super.getHash();

    return `${hash}:${this.driver?.id}:${this.action}${this.speed.current}`;
  }

  getJSON(): StaticMapVehicle {
    return {
      type: this.type,
      position: this.getRoundedPosition(),
      rotation: this.rotation.deg,
    };
  }
}
