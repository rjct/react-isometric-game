import { enemyTurn } from "@src/engine/_scenes/combat/enemyTurn";
import { heroTurn } from "@src/engine/_scenes/combat/heroTurn";
import { GameContext } from "@src/hooks/useGameState";

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
