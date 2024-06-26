import { StaticMapVehicle } from "@src/context/GameStateContext";
import {
  getVehicleDictEntityByType,
  VehicleActionType,
  VehicleDictEntity,
  VehicleSfxType,
  VehicleType,
} from "@src/dict/vehicle/_vehicle";
import { VehicleDerivedStatName } from "@src/dict/vehicle/_vehicleDerivedStst";
import { GameMap } from "@src/engine/gameMap";
import { degToRad, generateNumbersWithStep } from "@src/engine/helpers";
import { MovableGameEntity } from "@src/engine/MovableGameEntityFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { VehicleDerivedStat } from "@src/engine/vehicle/VehicleDerivedStatFactory";
import { calculateSizeAfterRotation, normalizeRotation } from "@src/engine/weapon/helpers";

export class Vehicle extends MovableGameEntity {
  public readonly type: VehicleType;
  public readonly className: string;
  public readonly dictEntity: VehicleDictEntity;
  private readonly rotationAngles: AngleInDegrees[];
  public realRotation: Angle;
  public action: VehicleActionType = "none";
  public driver: Unit | null = null;

  public currentPlayingSfx: { [type in VehicleSfxType]?: AudioBufferSourceNode } = {};
  public speed: {
    current: number;
    max: number;
  };
  public gearShiftMode: "reverse" | "neutral" | "drive";
  public accelerationEnabled = false;
  public readonly characteristics: { [characteristic in VehicleDerivedStatName]: VehicleDerivedStat };
  public damagePoints = 0;
  public isBroken = false;

  constructor(props: {
    gameState: GameMap;
    id?: string;
    type: VehicleType;
    position: GridCoordinates;
    rotation: AngleInDegrees;
  }) {
    const dictEntity = getVehicleDictEntityByType(props.type);

    super({
      gameState: props.gameState,
      id: props.id,
      dictEntity,
      position: props.position,
      rotation: props.rotation,
      internalColor: dictEntity.internalColor,
      lootable: true,
      blocksRays: true,
      occupiesCell: true,
    });

    this.dictEntity = dictEntity;

    this.type = props.type;
    this.className = ["vehicle", dictEntity.className].join(" ");

    this.speed = {
      current: 0,
      max: dictEntity.maxSpeed,
    };

    this.gearShiftMode = "neutral";

    const ROTATION_STEPS = 32;

    this.rotationAngles = generateNumbersWithStep(359, 360 / ROTATION_STEPS);

    this.realRotation = {
      deg: props.rotation,
      rad: degToRad(props.rotation),
    };
    this.setRotation(normalizeRotation(props.rotation, ROTATION_STEPS));

    this.characteristics = {
      healthPoints: new VehicleDerivedStat("healthPoints", this.dictEntity.characteristics.healthPoints),
      carryWeight: new VehicleDerivedStat("carryWeight", this.dictEntity.characteristics.carryWeight),
      armorClass: new VehicleDerivedStat("armorClass", this.dictEntity.characteristics.armorClass),
    };
  }

  public setAction(action: Vehicle["action"]) {
    this.action = action;
  }

  public setGearShiftMode(mode: Vehicle["gearShiftMode"]) {
    this.gearShiftMode = mode;
  }

  assignDriver(owner: Unit) {
    this.driver = owner;

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
  }

  getAvailableRotationAngles(): AngleInDegrees[] {
    return this.rotationAngles;
  }

  public setPosition(position: GridCoordinates, gameState: GameMap) {
    this.setDriverPosition(position, gameState);

    super.setPosition(position, gameState);
  }

  public setDriverPosition(position: GridCoordinates, gameState: GameMap) {
    this.driver?.setPosition(
      {
        x: position.x + this.size.grid.width / 2,
        y: position.y + this.size.grid.length / 2,
      },
      gameState,
    );
  }

  public stop() {
    this.clearPath();
    this.setGearShiftMode("neutral");
    this.pathQueue.atEnd = false;

    this.accelerationEnabled = false;
    this.speed.current = 0;

    if (this.driver) {
      this.setAction("idle");
    }
  }

  public getCurrentSpeed() {
    return this.speed.current;
  }

  public takeDamage(damage: number) {
    this.damagePoints = -damage;
    this.characteristics.healthPoints.value = Math.max(0, this.characteristics.healthPoints.value - damage);
    //this.setAction("hit");

    if (this.characteristics.healthPoints.value === 0) {
      this.action = "broken";
      this.isBroken = true;
    } else {
      window.setTimeout(() => {
        this.damagePoints = 0;
      }, this.dictEntity.animationDuration.collision);
    }
  }

  public getCarryWeight() {
    return this.characteristics.carryWeight.value;
  }

  public getClipPath() {
    return this.dictEntity.clipPath?.[this.action]?.[`${this.rotation.deg}deg`]?.cssClipPath;
  }

  public getHash(): string {
    const hash = super.getHash();

    return `${hash}:${this.driver?.id}:${this.action}${this.speed.current}`;
  }

  getJSON(): StaticMapVehicle {
    const json: StaticMapVehicle = {
      type: this.type,
      position: this.getRoundedPosition(),
      rotation: this.rotation.deg,
    };

    if (this.isCustomId) {
      json.id = this.id;
    }

    if (this.inventory?.main.length > 0) {
      json.inventory = {
        main: super.getInventoryMainJSON(),
      };
    }

    return json;
  }
}
