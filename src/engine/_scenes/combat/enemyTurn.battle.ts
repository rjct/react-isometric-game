import { Unit } from "@src/engine/unit/UnitFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { enemyTurnNoActionPoints } from "@src/engine/_scenes/combat/enemyTurn.noActionPoints";
import { GameContext } from "@src/hooks/useGameState";

export function enemyTurnBattle(
  this: GameContext,
  deltaTime: number,
  enemy: Unit,
  weapon: {
    hand: Exclude<keyof Unit["inventory"], "main">;
    weapon: Weapon;
  },
) {
  const { gameState, gameDispatch } = this;
  const hero = gameState.getHero();

  if (weapon.weapon.getCurrentAttackModeDetails().actionPointsConsumption > enemy.actionPoints.current) {
    return enemyTurnNoActionPoints.apply(this, [deltaTime, enemy]);
  }

  weapon.weapon.aimAt(hero.getRoundedPosition());

  gameDispatch({ type: "setCurrentUnitAction", unit: enemy, selectedAction: weapon.hand });

  gameDispatch({
    type: "useEntityInUnitHand",
    unit: enemy,
    hand: enemy.currentSelectedAction as Exclude<keyof Unit["inventory"], "main">,
    targetPosition: hero.getRoundedPosition(),
    consumeActionPoints: true,
  });

  gameDispatch({ type: "animateFiredAmmo", weapon: weapon.weapon, deltaTime });
  gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon: weapon.weapon });
  gameDispatch({ type: "cleanupFiredAmmo", weapon: weapon.weapon });
}
