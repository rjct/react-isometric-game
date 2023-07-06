import { GameContext } from "../../../hooks/useGameState";
import { heroTurnNoEnemies } from "./heroTurn.noEnemies";
import { heroTurnNoActionPoints } from "./heroTurn.noActionPoints";
import { heroTurnBattle } from "./heroTurn.battle";

export function heroTurn(this: GameContext, deltaTime: number) {
  const { gameState } = this;
  const hero = gameState.getHero();

  if (gameState.combatQueue.units.length === 0) {
    return heroTurnNoEnemies.apply(this);
  }

  if (hero.actionPoints.current === 0) {
    return heroTurnNoActionPoints.apply(this);
  }

  heroTurnBattle.apply(this, [deltaTime, hero]);
}
