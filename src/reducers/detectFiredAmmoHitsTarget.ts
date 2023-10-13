import { GameMap } from "@src/engine/gameMap";
import { calcDamage } from "@src/engine/weapon/helpers";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
};

export function detectFiredAmmoHitsTarget(state: GameMap) {
  state.ammoFiredIds.forEach((ammoId) => {
    const ammo = state.getAmmoById(ammoId);

    if (ammo && ammo.isTargetReached) {
      const unitAtTargetPosition = state.getUnitByCoordinates(ammo.position.grid);

      if (unitAtTargetPosition && ammo.loadedInWeapon) {
        const damage = calcDamage(ammo.loadedInWeapon, ammo);

        unitAtTargetPosition.takeDamage(damage);

        if (unitAtTargetPosition.isDead) {
          state.deOccupyCell(unitAtTargetPosition.getRoundedPosition());
        }
      }
    }
  });

  return state;
}
