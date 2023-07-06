import { GameContext } from "../../../hooks/useGameState";
import { Unit } from "../../UnitFactory";

export function enemyTurnNoActionPoints(this: GameContext, deltaTime: number, enemy: Unit) {
  const { gameState } = this;
  const hero = gameState.getHero();

  const currentIndex = gameState.combatQueue.units.findIndex((iter) => iter.id === gameState.combatQueue.currentUnitId);

  enemy.stop();
  enemy.restoreActionPoints();

  gameState.combatQueue.currentUnitId = gameState.combatQueue.units[currentIndex + 1]?.id || hero.id;
}
