import { GameMap } from "@src/engine/gameMap";
import { Ammo } from "@src/engine/weapon/AmmoFactory";

export type AnimateFiredAmmoAction = {
  type: "animateFiredAmmo";
  deltaTime: number;
};

export function animateFiredAmmo(state: GameMap, action: AnimateFiredAmmoAction): GameMap {
  const ammoFiredIds = state.ammoFiredIds;

  if (ammoFiredIds.length === 0) return state;

  const ammoFired = ammoFiredIds.map((id) => state.getAmmoById(id)).filter((ammo) => !ammo?.isTargetReached) as Ammo[];

  ammoFired.forEach((ammo) => {
    ammo.updatePosition(action.deltaTime, state);
  });

  return { ...state };
}
