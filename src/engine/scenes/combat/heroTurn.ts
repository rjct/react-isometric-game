import { heroTurnBattle } from "@src/engine/scenes/combat/heroTurn.battle";
import { heroTurnNoActionPoints } from "@src/engine/scenes/combat/heroTurn.noActionPoints";
import { heroTurnNoEnemies } from "@src/engine/scenes/combat/heroTurn.noEnemies";
import { GameContext } from "@src/hooks/useGameState";

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
