import { GameContext } from "@src/hooks/useGameState";

export function heroTurnNoActionPoints(this: GameContext) {
  this.gameDispatch({ type: "endTurn" });

  const hero = this.gameState.getHero();

  hero.stop();
  hero.restoreActionPoints();
}
