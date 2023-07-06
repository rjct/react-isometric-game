import { GameContext } from "../../../hooks/useGameState";
import { enemyTurnChaseHero } from "./enemyTurn.chaseHero";
import { enemyTurnNoActionPoints } from "./enemyTurn.noActionPoints";
import { enemyTurnBattle } from "./enemyTurn.battle";

export function enemyTurn(this: GameContext, deltaTime: number) {
  const { gameState } = this;
  const hero = gameState.getHero();

  const currentIndex = gameState.combatQueue.units.findIndex(
    (enemy) => enemy.id === gameState.combatQueue.currentUnitId
  );

  if (currentIndex >= gameState.combatQueue.units.length) {
    gameState.combatQueue.currentUnitId = hero.id;
    return;
  }

  const enemy = gameState.combatQueue.units[currentIndex];
  const enemyWeapon = enemy.getFirstAvailableWeaponInHands();

  if (enemyWeapon) {
    enemyWeapon.weapon.aimAt(hero.getRoundedPosition());
  }

  switch (true) {
    // Attack hero
    case enemy.pathQueue.points.length === 0 && enemy.getDistanceToEntity(hero) <= 1:
      enemyTurnBattle.apply(this, [deltaTime, enemy, enemyWeapon!]);
      break;

    // No more action points, next enemy turn
    case enemy.actionPoints.current === 0:
      enemyTurnNoActionPoints.apply(this, [deltaTime, enemy]);
      break;

    // Chase hero
    default:
      enemyTurnChaseHero.apply(this, [deltaTime, enemy]);
  }
}
