import { GameMap } from "@src/engine/gameMap";

export type AnimateFiredAmmoAction = {
  type: "animateFiredAmmo";
  deltaTime: number;
};

export function animateFiredAmmo(state: GameMap, action: AnimateFiredAmmoAction): GameMap {
  const ammoFiredIds = state.ammoFiredIds;

  if (ammoFiredIds.length === 0) return state;

  const ammoFired = ammoFiredIds.map((id) => state.getAmmoById(id)).filter((ammo) => ammo && !ammo.isTargetReached);

  ammoFired.forEach((ammo) => {
    if (ammo) ammo.updatePosition(action.deltaTime, state);
  });

  return { ...state };
}
