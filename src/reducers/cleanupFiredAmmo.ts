import { GameMap } from "../engine/GameMap";
import { Weapon } from "../engine/weapon/WeaponFactory";

export type CleanupFiredAmmoAction = {
  type: "cleanupFiredAmmo";
  weapon: null | Weapon;
};

export function cleanupFiredAmmo(state: GameMap, action: CleanupFiredAmmoAction): GameMap {
  if (!action.weapon) return state;

  const { firedAmmoQueue } = action.weapon;

  if (firedAmmoQueue.length == 0) return state;

  action.weapon.firedAmmoQueue = [...firedAmmoQueue.filter((ammo) => !ammo.isTargetReached)];

  return { ...state };
}
