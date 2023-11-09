import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { calcDamage } from "@src/engine/weapon/helpers";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
};

export function detectFiredAmmoHitsTarget(state: GameMap) {
  state.ammoFiredIds.forEach((ammoId) => {
    const ammo = state.getAmmoById(ammoId);

    if (ammo && ammo.isTargetReached) {
      const unitAtTargetPosition = state.getUnitByCoordinates(ammo.position.grid);
      const weapon = ammo.loadedInWeapon;

      if (unitAtTargetPosition && weapon) {
        const unit = weapon.owner as Unit;
        const damage = calcDamage(unit, weapon, ammo);

        unitAtTargetPosition.takeDamage(damage, state);

        if (unitAtTargetPosition.isDead) {
          state.deOccupyCell(unitAtTargetPosition.getRoundedPosition());
        }
      }
    }
  });

  return state;
}
