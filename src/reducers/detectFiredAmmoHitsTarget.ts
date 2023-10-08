import { GameMap } from "@src/engine/gameMap";
import { calcDamage } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
  weapon: null | Weapon;
};

export function detectFiredAmmoHitsTarget(state: GameMap, action: DetectFiredAmmoHitsTargetAction) {
  const { weapon } = action;

  if (!weapon) return state;

  const ammo = [...weapon.firedAmmoQueue.filter((ammo) => ammo.isTargetReached)];

  ammo.forEach((singleAmmo) => {
    const unitAtTargetPosition = state.getUnitByCoordinates(singleAmmo.position);

    if (unitAtTargetPosition) {
      const damage = calcDamage(weapon, singleAmmo);

      unitAtTargetPosition.takeDamage(damage);

      if (unitAtTargetPosition.isDead) {
        state.deOccupyCell(unitAtTargetPosition.getRoundedPosition());
      }
    }
  });

  return state;
}
