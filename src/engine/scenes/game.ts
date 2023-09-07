import { randomInt } from "@src/engine/helpers";
import { GameContext } from "@src/hooks/useGameState";

export function gameScene(this: GameContext, deltaTime: number) {
  const { gameState, gameDispatch, uiState, uiDispatch } = this;

  const allAliveUnits = gameState.getAllAliveUnitsArray();
  const allAliveEnemies = gameState.getAliveEnemiesArray();
  const heroWeapon = gameState.units[gameState.heroId]?.getCurrentWeapon();

  // User Input
  uiDispatch({ type: "scrollMapOnScreenEdges", deltaTime });

  // Update
  gameDispatch({ type: "detectHeroOnExitPoints", unit: gameState.getHero() });
  gameDispatch({ type: "animateUnitMove", units: allAliveUnits, deltaTime });

  for (const unit of allAliveUnits) {
    const weapon = unit.getCurrentWeapon();

    gameDispatch({ type: "animateFiredAmmo", weapon, deltaTime });
    gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon });
    gameDispatch({ type: "cleanupFiredAmmo", weapon });
    gameDispatch({
      type: "recalculateUnitDistanceToScreenCenter",
      unit,
      viewport: uiState.viewport,
      scroll: uiState.scroll,
    });
  }

  for (const enemy of allAliveEnemies) {
    // Mark enemy unit at gunpoint
    enemy.setAtGunpoint(
      !!heroWeapon &&
        heroWeapon.isReadyToUse() &&
        heroWeapon.getAimCoordinates()?.x === enemy.getRoundedPosition().x &&
        heroWeapon.getAimCoordinates()?.y === enemy.getRoundedPosition().y,
    );

    // Enemy unit perform random actions
    if (!enemy.isMoving()) {
      const randomActions = ["roam", "idle"];
      const randomAction = randomActions[randomInt(0, randomActions.length - 1)];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      enemy[randomAction](gameState);
    }

    enemy.cooldown(deltaTime);
  }
}
