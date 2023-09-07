import { pathFinderBiAStar } from "@src/engine/pathFinder";
import { Unit } from "@src/engine/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";

export function enemyTurnChaseHero(this: GameContext, deltaTime: number, enemy: Unit) {
  const { gameState, gameDispatch } = this;
  const hero = gameState.getHero();

  if (enemy.path.length === 0) {
    const unitPath = pathFinderBiAStar(gameState.matrix, enemy.getRoundedPosition(), hero.getRoundedPosition()); //gameState.calcUnitPath(enemy, hero.getRoundedPosition());

    unitPath.pop();

    if (unitPath.length > 0) {
      enemy.setPath(unitPath);
      enemy.setAction("run");
      gameDispatch({ type: "setCurrentUnitAction", unit: enemy, selectedAction: "run" });
    }
  }

  gameDispatch({ type: "animateUnitMove", units: [enemy], deltaTime, consumeActionPoints: true });
}
