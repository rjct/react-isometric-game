import { GameMap } from "../engine/GameMap";
import { Firearm } from "../engine/weapon/FirearmFactory";

export type CleanupFiredAmmoAction = {
  type: "cleanupFiredAmmo";
  weapon: null | Firearm;
};

export function cleanupFiredAmmo(state: GameMap, action: CleanupFiredAmmoAction): GameMap {
  if (!action.weapon) return state;

  const { firedAmmoQueue } = action.weapon;

  if (firedAmmoQueue.length == 0) return state;

  action.weapon.firedAmmoQueue = [...firedAmmoQueue.filter((ammo) => !ammo.isTargetReached)];

  return { ...state };
}
