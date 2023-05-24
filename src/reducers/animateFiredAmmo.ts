import { GameMap } from "../engine/GameMap";
import { Weapon } from "../engine/weapon/WeaponFactory";

export type AnimateFiredAmmoAction = {
  type: "animateFiredAmmo";
  weapon: null | Weapon;
  deltaTime: number;
};

export function animateFiredAmmo(state: GameMap, action: AnimateFiredAmmoAction): GameMap {
  if (!action.weapon) return state;

  const { firedAmmoQueue } = action.weapon;

  if (firedAmmoQueue.length === 0) return state;

  firedAmmoQueue
    .filter((ammo) => !ammo.isTargetReached)
    .forEach((ammo) => {
      ammo.updatePosition(action.deltaTime);
    });

  return { ...state };
}
