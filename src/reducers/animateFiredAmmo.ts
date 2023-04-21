import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";

export type AnimateFiredAmmoAction = {
  type: "animateFiredAmmo";
  unit: Unit;
  deltaTime: number;
};

export function animateFiredAmmo(state: typeof GameMap, action: AnimateFiredAmmoAction): typeof GameMap {
  const { firedAmmoQueue } = action.unit;

  if (firedAmmoQueue.length === 0) return state;

  firedAmmoQueue
    .filter((ammo) => !ammo.isTargetReached)
    .forEach((ammo) => {
      ammo.updatePosition(action.deltaTime);
    });

  return { ...state };
}
