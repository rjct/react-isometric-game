import { StaticMapWeapon } from "@src/context/GameStateContext";
import { WeaponDictEntity, WeaponName } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { FirearmAmmo } from "@src/engine/weapon/firearm/FirearmAmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export class Firearm extends Weapon {
  ammoCurrent: Ammo[] = [];

  constructor(weaponName: WeaponName, weaponDictEntity: WeaponDictEntity) {
    super(weaponName, weaponDictEntity);
  }

  use(targetPosition: GridCoordinates, gameState: GameMap) {
    if (!this.owner) return;

    const unit = this.owner as Unit;
    let count = 0;
    let fireInterval: number;

    const currentAttackModeDetails = this.getCurrentAttackModeDetails();

    const doFire = () => {
      const ammo = this.ammoCurrent.shift();

      if (!ammo) {
        return;
      }

      ammo.shot(unit.position, targetPosition, gameState);

      count++;

      if (count === currentAttackModeDetails.ammoConsumption) {
        clearInterval(fireInterval);

        setTimeout(() => {
          unit.setAction("none");
          this.setBusy(false);
        }, currentAttackModeDetails.animationDuration.attackCompleted);
      }
    };

    if (this.isReadyToUse(gameState) && this.ammoCurrent.length >= currentAttackModeDetails.ammoConsumption) {
      this.setBusy(true);
      gameState.playSfx(this.getSfx(this.currentAttackMode).src, 1, unit.distanceToScreenCenter);
      fireInterval = window.setInterval(doFire, 1);
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

    const ammoItems = this.owner.inventory.main
      .filter((item) => item instanceof FirearmAmmo && item.dictEntity.type === this.dictEntity.ammoType)
      .slice(0, this.dictEntity.ammoCapacity) as Ammo[];

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

  getJSON() {
    const weaponJson: StaticMapWeapon = super.getJSON();

    return weaponJson;
  }
}
