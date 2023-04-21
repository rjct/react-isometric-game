import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
  unit: Unit;
};

export function detectFiredAmmoHitsTarget(state: typeof GameMap, action: DetectFiredAmmoHitsTargetAction) {
  if (!action.unit) return state;

  const ammo = [...action.unit.firedAmmoQueue.filter((ammo) => ammo.isTargetReached)];

  ammo.forEach((singleAmmo) => {
    const unitAtTargetPosition = state.getUnitByCoordinates(singleAmmo.position);

    if (unitAtTargetPosition) {
      unitAtTargetPosition.takeDamage(singleAmmo);
    }
  });

  return state;
}
