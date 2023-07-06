import { GameContext } from "../../../hooks/useGameState";
import { heroTurn } from "./heroTurn";
import { enemyTurn } from "./enemyTurn";

export function combatScene(this: GameContext, deltaTime: number) {
  const { gameState } = this;
  const hero = gameState.getHero();

  gameState.combatQueue.units = gameState.getAliveEnemiesArray().filter((enemy) => {
    return !!enemy.getFirstAvailableWeaponInHands();
  });

  switch (gameState.combatQueue.currentUnitId) {
    case hero.id:
      heroTurn.apply(this, [deltaTime]);
      break;

    default:
      enemyTurn.apply(this, [deltaTime]);
  }
}
