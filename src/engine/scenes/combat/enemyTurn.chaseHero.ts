import { GameContext } from "../../../hooks/useGameState";
import { Unit } from "../../UnitFactory";
import { pathFinderBiAStar } from "../../pathFinder";

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
  gameDispatch({ type: "recalculateUnitFieldOfView", unit: enemy });
}
