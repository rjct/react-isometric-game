import { pathFinderBiAStar } from "@src/engine/unit/pathFinder";
import { Unit } from "@src/engine/unit/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";

export function enemyTurnChaseHero(this: GameContext, deltaTime: number, enemy: Unit) {
  const { gameState, gameDispatch } = this;
  const hero = gameState.getHero();

  if (enemy.path.length === 0) {
    const unitPath = pathFinderBiAStar(gameState.matrix, enemy.getRoundedPosition(), hero.getRoundedPosition()); //gameState.calcMovementPath(enemy, hero.getRoundedPosition());

    unitPath.pop();

    if (unitPath.length > 0) {
      enemy.setPath(unitPath);
      enemy.setAction("run");
      gameDispatch({ type: "setUnitMovementMode", unit: enemy, mode: "run" });
      gameDispatch({ type: "setCurrentUnitAction", unit: enemy, selectedAction: "move" });
    }
  }

  gameDispatch({ type: "animateEntitiesMove", entities: [enemy], deltaTime, consumeActionPoints: true });
}
