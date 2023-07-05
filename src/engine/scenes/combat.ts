import { GameContext } from "../../hooks/useGameState";

export function combatScene(this: GameContext, deltaTime: number) {
  const { gameState, gameDispatch, uiDispatch } = this;
  const hero = gameState.getHero();

  gameState.combatQueue.units = gameState.getAliveEnemiesArray();

  switch (true) {
    // Hero turn
    case gameState.combatQueue.currentUnitId === hero.id:
      if (gameState.combatQueue.units.length === 0) {
        gameDispatch({ type: "endCombat" });
        uiDispatch({ type: "setScene", scene: "game" });
        return;
      }

      if (hero.actionPoints.current === 0) {
        gameDispatch({ type: "endTurn" });
        hero.stop();
        hero.restoreActionPoints();
        break;
      }

      const heroWeapon = hero.getCurrentWeapon();

      gameDispatch({ type: "detectHeroOnExitPoints", unit: hero });
      gameDispatch({ type: "animateUnitMove", units: [hero], deltaTime, consumeActionPoints: true });

      gameDispatch({ type: "animateFiredAmmo", weapon: heroWeapon, deltaTime });
      gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon: heroWeapon });
      gameDispatch({ type: "cleanupFiredAmmo", weapon: heroWeapon });
      gameDispatch({ type: "recalculateUnitFieldOfView", unit: hero });

      for (const enemy of gameState.combatQueue.units) {
        // Mark enemy unit at gunpoint
        enemy.setAtGunpoint(
          !!heroWeapon &&
            heroWeapon.isReadyToUse() &&
            heroWeapon.getAimCoordinates()?.x === enemy.getRoundedPosition().x &&
            heroWeapon.getAimCoordinates()?.y === enemy.getRoundedPosition().y
        );

        gameDispatch({ type: "recalculateUnitFieldOfView", unit: enemy });
      }
      break;

    // Enemy turn
    case gameState.combatQueue.currentUnitId !== hero.id:
      const currentIndex = gameState.combatQueue.units.findIndex(
        (enemy) => enemy.id === gameState.combatQueue.currentUnitId
      );

      if (currentIndex >= gameState.combatQueue.units.length) {
        gameState.combatQueue.currentUnitId = hero.id;
        break;
      }

      const enemy = gameState.combatQueue.units[currentIndex];

      if (enemy.getDistanceToEntity(hero) <= 1 || enemy.actionPoints.current === 0) {
        enemy.stop();
        gameState.combatQueue.currentUnitId = gameState.combatQueue.units[currentIndex + 1]?.id || hero.id;

        if (enemy.actionPoints.current === 0) {
          enemy.restoreActionPoints();
        }
      } else {
        if (enemy.path.length === 0) {
          const unitPath = gameState.calcUnitPath(enemy, hero.getRoundedPosition());

          unitPath.pop();

          if (unitPath.length > 0) {
            enemy.setPath(unitPath);
            enemy.setAction("run");
          }
        }

        gameDispatch({ type: "animateUnitMove", units: [enemy], deltaTime, consumeActionPoints: true });
        gameDispatch({ type: "recalculateUnitFieldOfView", unit: enemy });
      }
      break;
  }
}
