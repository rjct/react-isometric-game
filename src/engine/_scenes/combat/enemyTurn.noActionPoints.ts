import { Unit } from "@src/engine/unit/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";

export function enemyTurnNoActionPoints(this: GameContext, deltaTime: number, enemy: Unit) {
  const { gameState } = this;
  const hero = gameState.getHero();

  const currentIndex = gameState.combatQueue.units.findIndex((iter) => iter.id === gameState.combatQueue.currentUnitId);

  enemy.stop();
  enemy.restoreActionPoints();

  gameState.combatQueue.currentUnitId = gameState.combatQueue.units[currentIndex + 1]?.id || hero.id;
}
