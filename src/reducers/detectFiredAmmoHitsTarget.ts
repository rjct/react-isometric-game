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

      if (unitAtTargetPosition && !unitAtTargetPosition.isDead && weapon) {
        const shooter = weapon.owner as Unit;
        const damage = calcDamage(shooter, weapon, ammo);

        unitAtTargetPosition.takeDamage(damage, state);

        if (unitAtTargetPosition.isDead) {
          shooter.characteristics.earnXp(unitAtTargetPosition.dictEntity.rewardXpPoints);
          state.deOccupyCell(unitAtTargetPosition.getRoundedPosition());
          unitAtTargetPosition.blocksRays = false;
        }
      }
    }
  });

  return state;
}
