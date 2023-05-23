import { GameMap } from "../engine/GameMap";
import { Firearm } from "../engine/weapon/FirearmFactory";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
  weapon: null | Firearm;
};

export function detectFiredAmmoHitsTarget(state: GameMap, action: DetectFiredAmmoHitsTargetAction) {
  if (!action.weapon) return state;

  const ammo = [...action.weapon.firedAmmoQueue.filter((ammo) => ammo.isTargetReached)];

  ammo.forEach((singleAmmo) => {
    const unitAtTargetPosition = state.getUnitByCoordinates(singleAmmo.position);

    if (unitAtTargetPosition) {
      unitAtTargetPosition.takeDamage(singleAmmo);
    }
  });

  return state;
}
