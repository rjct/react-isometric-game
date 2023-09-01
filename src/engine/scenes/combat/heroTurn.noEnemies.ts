import { GameContext } from "@src/hooks/useGameState";

export function heroTurnNoEnemies(this: GameContext) {
  this.gameDispatch({ type: "endCombat" });
  this.uiDispatch({ type: "setScene", scene: "game" });
}
