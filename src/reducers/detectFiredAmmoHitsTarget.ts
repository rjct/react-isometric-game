import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { calcBlastDamage, calcDamage } from "@src/engine/weapon/helpers";

export type DetectFiredAmmoHitsTargetAction = {
  type: "detectFiredAmmoHitsTarget";
};

export function detectFiredAmmoHitsTarget(state: GameMap) {
  state.ammoFiredIds.forEach((ammoId) => {
    const ammo = state.getAmmoById(ammoId);

    if (ammo && ammo.isTargetReached) {
      const weapon = ammo.loadedInWeapon!;
      const shooter = weapon.owner as Unit;
      const weaponBlastDamage = weapon?.getCurrentAttackModeDetails().blastRadius;
      const blastDamage = calcBlastDamage(
        ammo.position.grid,
        weaponBlastDamage || 0,
        calcDamage(shooter, weapon, ammo),
      );

      const unitsAtTargetArea = state.getUnitsByCoordinatesInRadius(ammo.position.grid, weaponBlastDamage);

      for (const unit of unitsAtTargetArea) {
        if (unit.isDead || !weapon) continue;

        const { x, y } = unit.getRoundedPosition();
        const damage = blastDamage[`${x}:${y}`];

        if (damage) {
          unit.takeDamage(damage, state);
        }

        if (unit.isDead) {
          shooter.characteristics.earnXp(unit.dictEntity.rewardXpPoints);
          state.deOccupyCell(unit.getRoundedPosition());
          unit.blocksRays = false;
        }
      }
    }
  });

  return state;
}
