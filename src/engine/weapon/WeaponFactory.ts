import { StaticMapWeapon } from "@src/context/GameStateContext";
import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponAttackMode, WeaponDictEntity, WeaponName, WeaponSfxType } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { floor, getAngleBetweenTwoGridPoints, getDistanceBetweenGridPoints, randomUUID } from "@src/engine/helpers";
import { InventoryItem } from "@src/engine/InventoryItemFactory";
import { ObstacleRay } from "@src/engine/light/ObstacleRayFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { createAmmoByName } from "@src/engine/weapon/helpers";

export class Weapon extends InventoryItem {
  public readonly class = "weapon";
  public readonly id = randomUUID();
  public readonly name: WeaponName;
  public readonly dictEntity: WeaponDictEntity;

  public currentAttackMode: WeaponAttackMode;

  private targetPosition: null | GridCoordinates = null;
  public ray: null | ObstacleRay = null;
  public angle: { rad: number; deg: number } = { rad: Infinity, deg: Infinity };
  private isBusy = false;

  use(targetPosition: GridCoordinates, gameState: GameMap) {
    if (!this.owner) return;

    const unit = this.owner as Unit;
    const currentAttackModeDetails = this.getCurrentAttackModeDetails();

    if (this.isReadyToUse(gameState)) {
      gameState.playSfx(this.getSfx(this.currentAttackMode).src, 1, unit.distanceToScreenCenter);

      const fakeAmmo = createAmmoByName(currentAttackModeDetails.ammoType as AmmoName, gameState);
      fakeAmmo.loadedInWeapon = this;

      if (currentAttackModeDetails.removeFromInventoryAfterUse) {
        const inventoryType = unit.findInventoryEntityPlaceType(this);

        if (inventoryType) {
          unit.removeItemFromInventory(this, inventoryType);
        }
      }

      this.setBusy(true);

      unit.setAction(this.currentAttackMode);

      setTimeout(() => {
        fakeAmmo.shot(unit.position.grid, targetPosition, gameState);
      }, currentAttackModeDetails.animationDuration.attack);

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackCompleted);
    } else {
      this.setBusy(true);
      unit.setAction("idle");

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackNotAllowed);
    }
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

  getAllowedAmmoTypes() {
    return [
      ...new Set(
        this.getAttackModes()
          .filter((attackMode) => attackMode !== "punch")
          .map((attackMode) => this.dictEntity.attackModes[attackMode]!.ammoType),
      ),
    ];
  }

  aimAt(position: GridCoordinates) {
    this.targetPosition = position;

    if (this.owner) {
      this.ray = new ObstacleRay(this.owner.position.grid, this.targetPosition);
      this.angle = getAngleBetweenTwoGridPoints(this.owner.getRoundedPosition(), this.targetPosition);
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
      return floor(getDistanceBetweenGridPoints(this.owner.position.grid, this.targetPosition));
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
