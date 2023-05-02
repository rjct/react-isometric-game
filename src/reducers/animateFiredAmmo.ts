import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";

export type AnimateFiredAmmoAction = {
  type: "animateFiredAmmo";
  unit: Unit;
  deltaTime: number;
};

export function animateFiredAmmo(state: GameMap, action: AnimateFiredAmmoAction): GameMap {
  const { firedAmmoQueue } = action.unit;

  if (firedAmmoQueue.length === 0) return state;

  firedAmmoQueue
    .filter((ammo) => !ammo.isTargetReached)
    .forEach((ammo) => {
      ammo.updatePosition(action.deltaTime);
    });

  return { ...state };
}
