import { StaticMapUnit } from "@src/context/GameStateContext";

import {
  getUnitDictEntityByType,
  UnitActionType,
  UnitDictEntity,
  UnitSfxEntity,
  UnitSfxType,
  UnitType,
} from "@src/dict/unit/_unit";
import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { getDistanceBetweenGridPoints, randomInt } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { ObstacleRay } from "@src/engine/light/ObstacleRayFactory";
import { MovableGameEntity } from "@src/engine/MovableGameEntityFactory";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";
import { UnitFieldOfViewFactory } from "@src/engine/unit/UnitFieldOfViewFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { itemIsWeapon, normalizeRotation } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type UnitShadow = {
  blocked: boolean;
  light: Light;
  opacity: number;
  length: number;
  angle: number;
};

export type UnitMovementMode = Extract<Unit["action"], "walk" | "run">;

export class Unit extends MovableGameEntity {
  public readonly dictEntity: UnitDictEntity;
  public readonly isHero: boolean;
  public readonly type;

  public readonly className;

  public readonly speed: {
    walk: number;
    run: number;
  };

  public action: UnitActionType;

  public characteristics: UnitCharacteristics;

  public actionPoints: {
    current: number;
    readonly max: number;
    readonly consumption: UnitDictEntity["actionPoints"]["consumption"];
  };

  public damagePoints = 0;

  public isDead: boolean;

  public currentMovementMode: UnitMovementMode = "walk";
  public currentSelectedAction: "move" | "explore" | "leftHand" | "rightHand" = "move";

  public readonly coolDownTime: number;
  public coolDownTimer = 0;

  public readonly animationDuration: {
    hit: number;
    notAllowed: number;
  };

  public shadows: Array<UnitShadow> = [];

  public atGunpoint = false;
  public fieldOfView: UnitFieldOfViewFactory;
  public distanceToHero = Infinity;

  public readonly sfx: {
    [type in UnitSfxType]: UnitSfxEntity & { currentProgressMs: number };
  };

  public distanceToScreenCenter = -1;

  public randomActions: string[];

  private vehicleInUse: Vehicle | null = null;

  constructor(props: {
    gameState: GameMap;
    unitType: UnitType;
    position: GridCoordinates;
    isHero: boolean;
    action?: Unit["action"];
    isDead?: boolean;
    healthPoints?: Unit["characteristics"]["derived"]["healthPoints"];
    rotation?: AngleInDegrees;
    randomActions?: StaticMapUnit["randomActions"];
  }) {
    const dictEntity = getUnitDictEntityByType(props.unitType); //units[props.unitType] as DictUnit;

    super({
      gameState: props.gameState,
      size: dictEntity.size,
      position: props.position,
      rotation: props.rotation || 0,
      internalColor: props.isHero ? "rgba(255,255,255,0.5)" : "rgba(255,0,0,0.5)",
      blocksRays: true,
      explorable: true,
    });

    this.dictEntity = dictEntity;

    this.characteristics = new UnitCharacteristics();

    this.isHero = props.isHero;
    this.type = props.unitType;

    this.className = ["unit", dictEntity.className].join(" ");
    this.speed = dictEntity.speed;
    this.coolDownTime = dictEntity.coolDownTime;
    this.animationDuration = dictEntity.animationDuration;

    this.action = props.action || "none";

    this.actionPoints = {
      current: dictEntity.actionPoints.max,
      max: dictEntity.actionPoints.max,
      consumption: { ...dictEntity.actionPoints.consumption },
    };
    this.randomActions = props.randomActions || ["roam", "idle"];

    this.isDead = props.isDead === true;

    this.fieldOfView = new UnitFieldOfViewFactory({
      position: this.position.grid,
      rotation: this.rotation,
      fieldOfView: dictEntity.fieldOfView,
    });

    this.sfx = Object.keys(dictEntity.sfx).reduce(
      (acc, key) => {
        const k = key as UnitSfxType;

        acc[k] = { ...dictEntity.sfx[k], ...{ currentProgressMs: 0 } };

        return acc;
      },
      {} as unknown as Unit["sfx"],
    );

    this.inventory = {
      main: [],
      leftHand: null,
      rightHand: null,
    };
  }

  public setRotation(angle: Angle, normalize = true) {
    if (normalize) {
      angle = normalizeRotation(angle.deg, 4);
    }

    super.setRotation(angle);

    this.fieldOfView.setRotation(angle);
  }

  public getCurrentSpeed() {
    return this.action === "run" ? this.speed.run : this.speed.walk;
  }

  public setPosition(position: GridCoordinates, gameState: GameMap, deltaTime = -1) {
    super.setPosition(position, gameState);
    this.fieldOfView.setPosition(position);

    const hero = gameState.getHero();

    this.distanceToHero = !hero ? Infinity : this.getDistanceToEntity(hero);

    if (deltaTime > -1) {
      if (
        this.sfx["walkStep"].currentProgressMs === 0 ||
        this.sfx["walkStep"].currentProgressMs >= this.sfx["walkStep"].repeatEveryMs! / this.getCurrentSpeed()
      ) {
        gameState.playSfx(
          this.sfx["walkStep"].src,
          this.id === hero.id ? 1 : 1 - Math.min(100, (this.distanceToHero * 100) / hero.fieldOfView.range) / 100,
          this.distanceToScreenCenter,
        );

        if (this.sfx["walkStep"].currentProgressMs > 0) {
          this.sfx["walkStep"].currentProgressMs = 0;
        }
      }

      this.sfx["walkStep"].currentProgressMs += deltaTime * 1000;
    }
  }

  public setPositionComplete() {
    this.sfx["walkStep"].currentProgressMs = 0;

    super.setPositionComplete();
  }

  public setAction(action: Unit["action"]) {
    this.action = action;
  }

  public isBusy() {
    return this.action !== "none" && this.action !== "idle";
  }

  public isUsingHands() {
    return this.currentSelectedAction === "leftHand" || this.currentSelectedAction === "rightHand";
  }

  public getCurrentWeapon() {
    if (!this.isUsingHands()) return null;

    return this.currentSelectedAction === "leftHand" ? this.inventory.leftHand : this.inventory.rightHand;
  }

  public getFirstAvailableWeaponInHands(): {
    hand: Exclude<keyof Unit["inventory"], "main">;
    weapon: Weapon;
  } | null {
    if (this.inventory.leftHand instanceof Weapon) {
      return { hand: "leftHand", weapon: this.inventory.leftHand };
    }

    if (this.inventory.rightHand instanceof Weapon) {
      return { hand: "rightHand", weapon: this.inventory.rightHand };
    }

    return null;
  }

  public getBackpackItems() {
    return this.inventory.main;
  }

  public isAllowedToPutItemInInventory(inventoryItem: Weapon | Ammo, inventoryType: keyof Unit["inventory"]) {
    if (inventoryType === "main") return true;

    return this.inventory[inventoryType] === null && itemIsWeapon(inventoryItem);
  }

  public findInventoryEntityPlaceType(entity: Weapon | Ammo): keyof Unit["inventory"] | null {
    if (this.inventory.main.find((backpackItem) => backpackItem.id === entity.id)) {
      return "main";
    }

    if (this.inventory.leftHand?.id === entity.id) {
      return "leftHand";
    }

    if (this.inventory.rightHand?.id === entity.id) {
      return "rightHand";
    }

    return null;
  }

  public removeItemFromInventory(item: Weapon | Ammo, inventoryType: keyof Unit["inventory"]) {
    const itemOnInventory =
      this.inventory.main.find((backpackItem) => backpackItem.id === item.id) ||
      this.inventory.leftHand ||
      this.inventory.rightHand;

    if (itemOnInventory) {
      if (inventoryType === "main") {
        const index = this.inventory.main.findIndex((item) => item.id === itemOnInventory.id);
        this.inventory.main.splice(index, 1);
      } else {
        this.inventory[inventoryType] = null;
      }
    }
  }

  public getInventoryItemById(itemId: string) {
    return this.getInventoryItems().find((item) => item?.id === itemId);
  }

  public takeDamage(damage: number, gameState: GameMap) {
    this.damagePoints = -damage;
    this.characteristics.derived.healthPoints.value = Math.max(
      0,
      this.characteristics.derived.healthPoints.value - damage,
    );

    this.clearPath();
    this.coolDownTimer = this.coolDownTime;

    if (this.characteristics.derived.healthPoints.value === 0) {
      gameState.playSfx(this.sfx["dead"].src, this.distanceToScreenCenter);

      this.action = "dead";
      this.isDead = true;
    } else {
      gameState.playSfx(this.sfx["hit"].src, this.distanceToScreenCenter);
      this.action = "hit";

      window.setTimeout(() => {
        this.damagePoints = 0;
        this.action = "none";
      }, this.animationDuration.hit);
    }
  }

  public setDistanceToScreenCenter(distanceToScreenCenter: number) {
    this.distanceToScreenCenter = distanceToScreenCenter;
  }

  public consumeActionPoints(actionPoints: number) {
    this.actionPoints.current = Math.max(0, this.actionPoints.current - actionPoints);
  }

  public restoreActionPoints() {
    this.actionPoints.current = this.actionPoints.max;
  }

  public getCurrentActionPointsConsumption() {
    switch (this.currentSelectedAction) {
      case "move":
        return this.actionPoints.consumption[this.currentMovementMode]!;

      case "leftHand":
      case "rightHand":
        const weapon = this.getCurrentWeapon();

        if (weapon) {
          return weapon.getCurrentAttackModeDetails().actionPointsConsumption!;
        }

        return 0;

      case "explore":
        return this.actionPoints.consumption.explore!;
    }
  }

  public roam(gameState: GameMap) {
    if (this.coolDownTimer > 0 || this.isBusy()) return;
    const getRandomPosition = (): GridCoordinates => {
      return { x: randomInt(0, gameState.mapSize.width - 1), y: randomInt(0, gameState.mapSize.height - 1) };
    };

    let newPosition = getRandomPosition();

    if (gameState.isCellOccupied(newPosition)) {
      while (gameState.isCellOccupied(newPosition)) {
        newPosition = getRandomPosition();
      }
    }

    const path = pathFinderAStar(gameState.matrix, this.position.grid, newPosition);

    if (path.length > 1) {
      this.setPath(path);

      const roamActions = ["walk", "run"] as Extract<Unit["action"], "walk" | "run">[];
      const randomRoamAction = roamActions[randomInt(0, roamActions.length - 1)];

      this.setAction(randomRoamAction);
      this.coolDownTimer = this.coolDownTime;

      return;
    }

    this.coolDownTimer = 0;
  }

  idle() {
    if (this.coolDownTimer > 0 || this.isBusy()) return;

    this.setAction("idle");
    this.coolDownTimer = this.coolDownTime;
  }

  public cooldown(deltaTime: number) {
    if (this.isBusy()) return;

    this.coolDownTimer = Math.max(0, this.coolDownTimer - deltaTime);
  }

  public stop() {
    this.setAction("none");
    this.clearPath();
  }

  public calcShadows(gameState: GameMap) {
    if (this.isDead || !gameState.settings.featureEnabled.unitShadow) {
      this.clearShadows();

      return;
    }

    this.shadows = gameState.lights
      .filter((light) => light.radius >= getDistanceBetweenGridPoints(this.position.grid, light.position))
      .map((light) => {
        const distance = getDistanceBetweenGridPoints(this.position.grid, light.position);
        const obstacleRay = new ObstacleRay(light.position, this.position.grid, true);
        const distanceToRayEnd = obstacleRay.getDistanceToRayEndPosition(gameState, true);

        return {
          light,
          blocked: distance - 1 > distanceToRayEnd,
          opacity: 1 - distance / light.radius - 0.1,
          length: Number((0.1 + distance / 5).toFixed(1)),
          angle: obstacleRay.getAngle().deg + 225,
        };
      });
  }

  public clearShadows() {
    this.shadows = [];
  }

  public setAtGunpoint(state: boolean) {
    this.atGunpoint = state;
  }

  public getDistanceToEntity(entity: Unit | Building) {
    return getDistanceBetweenGridPoints(this.getRoundedPosition(), entity.getRoundedPosition());
  }

  public isExplorable() {
    return super.isExplorable() && this.isDead;
  }

  public isVehicleInUse() {
    return this.vehicleInUse !== null;
  }

  public getVehicleInUse() {
    return this.vehicleInUse;
  }

  public getIntoVehicle(vehicle: Vehicle) {
    this.vehicleInUse = vehicle;
  }

  public getOutOfVehicle() {
    if (!this.vehicleInUse) return;

    this.vehicleInUse = null;
  }

  public calculateHitCoordinates(targetCoordinates: GridCoordinates, probability: number): GridCoordinates {
    const randomPercent = randomInt(0, 100);

    if (randomPercent <= probability) {
      return targetCoordinates;
    } else {
      const INACCURACY_CELLS = 2;

      const xModifier = randomInt(-INACCURACY_CELLS * 100, INACCURACY_CELLS * 100) / 100;
      const yModifier = randomInt(-INACCURACY_CELLS * 100, INACCURACY_CELLS * 100) / 100;

      return {
        x: targetCoordinates.x + xModifier,
        y: targetCoordinates.y + yModifier,
      };
    }
  }

  public getJSON(omitUnitType = false) {
    const json: StaticMapUnit = {
      type: this.type,
      position: this.getRoundedPosition(),
      rotation: this.rotation.deg,
    };

    if (this.isDead) {
      json.isDead = true;
    }

    if (this.getInventoryItems().length > 0) {
      json.inventory = {} as StaticMapUnit["inventory"];

      if (this.inventory.main) {
        json.inventory = {
          ...json.inventory,
          ...{ main: super.getInventoryMainJSON() },
        };
      }

      if (this.inventory.leftHand) {
        json.inventory = { ...json.inventory, ...{ leftHand: super.getInventoryHandJSON("leftHand") } };
      }

      if (this.inventory.rightHand) {
        json.inventory = { ...json.inventory, ...{ rightHand: super.getInventoryHandJSON("rightHand") } };
      }
    }

    if (omitUnitType) {
      delete json.type;
    }

    return json;
  }

  public getHash(): string {
    const hash = super.getHash();

    return `${hash}:${Object.keys(this.fieldOfView.entitiesInView).length}`;
  }
}
