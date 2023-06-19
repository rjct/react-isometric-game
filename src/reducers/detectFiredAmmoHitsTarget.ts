import { GameMap } from "../engine/GameMap";
import { Weapon } from "../engine/weapon/WeaponFactory";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
  weapon: null | Weapon;
};

export function detectFiredAmmoHitsTarget(state: GameMap, action: DetectFiredAmmoHitsTargetAction) {
  if (!action.weapon) return state;

  const ammo = [...action.weapon.firedAmmoQueue.filter((ammo) => ammo.isTargetReached)];

  ammo.forEach((singleAmmo) => {
    const unitAtTargetPosition = state.getUnitByCoordinates(singleAmmo.position);

    if (unitAtTargetPosition) {
      unitAtTargetPosition.takeDamage(singleAmmo.damage);

      if (unitAtTargetPosition.isDead) {
        state.deOccupyCell(unitAtTargetPosition.getRoundedPosition());
      }
    }
  });

  return state;
}
