import { StaticMapWeapon } from "@src/context/GameStateContext";
import { WeaponAttackMode, WeaponDictEntity, WeaponName, WeaponSfxType } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { floor, getDistanceBetweenGridPoints, randomUUID } from "@src/engine/helpers";
import { InventoryItem } from "@src/engine/InventoryItemFactory";
import { ObstacleRay } from "@src/engine/light/ObstacleRayFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";

export class Weapon extends InventoryItem {
  public readonly class = "weapon";
  public readonly id = randomUUID();
  public readonly name: WeaponName;
  public readonly dictEntity: WeaponDictEntity;

  public currentAttackMode: WeaponAttackMode;

  private targetPosition: null | GridCoordinates = null;
  public ray: null | ObstacleRay = null;

  private isBusy = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(targetPosition: GridCoordinates, gameState: GameMap) {
    throw new Error("Method not implemented.");
  }

  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super();
    this.name = weaponName;
    this.dictEntity = weaponDictEntity;
    this.currentAttackMode = Object.keys(weaponDictEntity.attackModes)[0] as WeaponAttackMode;
  }

  setAttackMode(attackMode: WeaponAttackMode) {
    this.currentAttackMode = attackMode;
  }

  getAttackModes() {
    return Object.keys(this.dictEntity.attackModes) as WeaponAttackMode[];
  }

  aimAt(position: GridCoordinates) {
    this.targetPosition = position;
    if (this.owner) {
      this.ray = new ObstacleRay(this.owner.position, this.targetPosition);
    }
  }

  stopAiming() {
    this.targetPosition = null;
    this.ray = null;
  }

  isAimed() {
    return !!this.targetPosition;
  }

  getAimCoordinates() {
    return this.targetPosition;
  }

  getDistanceToTarget() {
    if (this.targetPosition && this.owner) {
      return floor(getDistanceBetweenGridPoints(this.owner.position, this.targetPosition));
    }

    return Infinity;
  }

  isReadyToUse(gameState: GameMap) {
    if (!this.owner || !this.targetPosition || this.busy()) return false;

    const distanceToTarget = this.getDistanceToTarget();
    const distanceToRayEnd = this.ray?.getDistanceToRayEndPosition(gameState);

    return distanceToTarget <= this.getCurrentAttackModeDetails().range && distanceToTarget === distanceToRayEnd;
  }

  getCurrentAttackModeDetails() {
    return this.dictEntity.attackModes[this.currentAttackMode]!;
  }

  setBusy(isBusy: boolean) {
    this.isBusy = isBusy;
  }

  busy() {
    return this.isBusy;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAfterAmmoReachedTarget(ammo: Ammo, gameState: GameMap) {
    //
  }

  getSfx(sfxType: WeaponSfxType) {
    return (
      this.dictEntity.sfx[sfxType] || {
        src: [],
        timeIntervalMs: 0,
      }
    );
  }

  getJSON() {
    const weaponJson: StaticMapWeapon = {
      class: "weapon",
      name: this.name,
    };

    return weaponJson;
  }
}

export type WeaponFactory = typeof Weapon;
