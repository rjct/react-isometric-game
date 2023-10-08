import { randomInt } from "@src/engine/helpers";
import { mapsList } from "@src/engine/maps_list";
import { GameContext } from "@src/hooks/useGameState";

export function gameScene(this: GameContext, deltaTime: number) {
  const { fxDispatch, terrainState, gameState, gameDispatch, uiState } = this;

  const allAliveUnits = gameState.getAllAliveUnitsArray();
  const allAliveEnemies = gameState.getAliveEnemiesArray();
  const hero = gameState.units[gameState.heroId];
  const heroWeapon = hero?.getCurrentWeapon();

  // User Input
  // if (isBrowser) {
  //   uiDispatch({ type: "scrollMapOnScreenEdges", deltaTime });
  // }

  // Update
  if (hero && terrainState.isUnitIsInExitPoint(hero)) {
    const mapUrl = terrainState.getTerrainAreaByCoordinates(hero.position).exitUrl! as mapsList;

    gameDispatch({ type: "updateMapUrl", mapUrl });
  }

  gameDispatch({ type: "animateUnitMove", units: allAliveUnits, deltaTime });

  Object.values(gameState.weapon).forEach((weapon) => {
    gameDispatch({ type: "animateFiredAmmo", weapon, deltaTime });
    gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon });

    weapon.firedAmmoQueue
      .filter((ammo) => ammo.isTargetReached)
      .forEach((ammo) => {
        if (ammo.dictEntity.fx?.targetReached) {
          ammo.dictEntity.fx.targetReached.forEach((effectType) => {
            fxDispatch({ type: "addFx", effectType, coordinates: ammo.position });
          });

          ammo.afterTargetReached(gameState);
        }
      });

    weapon.firedAmmoQueue = [...weapon.firedAmmoQueue.filter((ammo) => !ammo.isTargetReached)];

    //gameDispatch({ type: "cleanupFiredAmmo", weapon });
  });

  for (const unit of allAliveUnits) {
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
