import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";

export type CleanupFiredAmmoAction = {
  type: "cleanupFiredAmmo";
  unit: Unit;
};

export function cleanupFiredAmmo(state: typeof GameMap, action: CleanupFiredAmmoAction): typeof GameMap {
  if (!action.unit) return state;

  const { id } = action.unit;

  if (action.unit.firedAmmoQueue.length == 0) return state;

  state.units[id].firedAmmoQueue = [...action.unit.firedAmmoQueue.filter((ammo) => !ammo.isTargetReached)];

  return { ...state };
}
