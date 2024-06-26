import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { randomInt } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vfx } from "@src/engine/vfx/VfxFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { FirearmAmmo } from "@src/engine/weapon/firearm/FirearmAmmoFactory";
import { LaserAmmo } from "@src/engine/weapon/laser/LaserAmmoFactory";

export class Firearm extends Weapon {
  ammoCurrent: Ammo[] = [];

  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super(weaponName, weaponDictEntity);
  }

  use(targetPosition: GridCoordinates, gameState: GameMap) {
    if (!this.owner) return;

    const unit = this.owner as Unit;
    let consumedAmmoCount = 0;
    let consumeAmmoInterval: number;

    const currentAttackModeDetails = this.getCurrentAttackModeDetails();
    const vfx = this.dictEntity.vfx[this.currentAttackMode];

    const doFire = () => {
      const ammo = this.ammoCurrent.shift();

      if (!ammo) {
        return;
      }

      ammo.shot(
        unit.position.grid,
        unit.calculateHitCoordinates(
          targetPosition,
          gameState.calculateHitProbability(unit, targetPosition), //unit.characteristics.skills[currentAttackModeDetails.skill].value
        ),
        gameState,
      );

      if (vfx) {
        const randomVfxType = vfx.type[randomInt(0, vfx.type.length - 1)];

        const emittedVfx = new Vfx({
          coordinates: unit.getRoundedPosition(),
          type: randomVfxType,
          angle: this.angle.deg,
          animationDuration: vfx.animationDuration,
          animationDelay: `${vfx.delayBeforeEmitting}ms`,
          light: vfx.light,
        });

        if (emittedVfx.lightEffect?.light) {
          gameState.lights.push(emittedVfx.lightEffect.light);
          emittedVfx.lightEffect.light.cast(gameState.getAllGameEntitiesWalls());
        }

        gameState.visualEffects.push(emittedVfx);
      }

      consumedAmmoCount++;

      if (consumedAmmoCount === currentAttackModeDetails.ammoConsumption) {
        clearInterval(consumeAmmoInterval);

        setTimeout(() => {
          unit.setAction("none");
          this.setBusy(false);
        }, currentAttackModeDetails.animationDuration.attackCompleted);
      }
    };

    if (this.isReadyToUse(gameState) && this.ammoCurrent.length >= currentAttackModeDetails.ammoConsumption) {
      this.setBusy(true);
      unit.setAction(this.currentAttackMode);

      setTimeout(() => {
        gameState.playSfx(this.getSfx(this.currentAttackMode).src, 1, unit.distanceToScreenCenter);

        consumeAmmoInterval = window.setInterval(doFire, vfx?.delayBetweenEmitting || 1);
      }, currentAttackModeDetails.animationDuration.attack);
    } else {
      unit.setAction("idle");
      gameState.playSfx(this.getSfx("outOfAmmo").src, 1, unit.distanceToScreenCenter);

      setTimeout(() => {
        unit.setAction("none");
        this.setBusy(false);
      }, currentAttackModeDetails.animationDuration.attackNotAllowed);
    }
  }

  reload(gameState: GameMap) {
    if (!this.owner) return;

    const currentAttackModeDetails = this.getCurrentAttackModeDetails();
    const ammoItems = this.owner.inventory.main
      .filter(
        (item) =>
          (item instanceof FirearmAmmo || item instanceof LaserAmmo) &&
          item.dictEntity.type === currentAttackModeDetails.ammoType,
      )
      .slice(0, this.dictEntity.ammoCapacity! - this.ammoCurrent.length) as Ammo[];

    if (ammoItems.length === 0) {
      gameState.playSfx(this.getSfx("outOfAmmo").src, 1);
      return;
    }

    ammoItems.forEach((ammo) => (ammo.loadedInWeapon = this));
    this.ammoCurrent.push(...ammoItems);

    const removedIds = new Set(ammoItems.map((item) => item.id));
    this.owner.inventory.main = this.owner.inventory.main.filter((item) => !removedIds.has(item.id));

    gameState.playSfx(this.getSfx("reload").src, 1);
  }

  unload() {
    if (!this.owner || this.ammoCurrent.length === 0) return;

    this.ammoCurrent.forEach((ammo) => (ammo.loadedInWeapon = null));
    this.owner.inventory.main.push(...this.ammoCurrent);
    this.ammoCurrent = [];
  }

  onAfterAmmoReachedTarget(ammo: Ammo, gameState: GameMap) {
    delete gameState.ammo[ammo.id];
  }

  isReadyToUse(gameState: GameMap) {
    return (
      super.isReadyToUse(gameState) && this.ammoCurrent.length >= this.getCurrentAttackModeDetails().ammoConsumption
    );
  }
}
