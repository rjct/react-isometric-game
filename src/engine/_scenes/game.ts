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
  gameDispatch({ type: "animateFiredAmmo", deltaTime });
  gameDispatch({ type: "detectFiredAmmoHitsTarget" });

  gameState.ammoFiredIds
    .filter((ammoId) => gameState.getAmmoById(ammoId)?.isTargetReached)
    .forEach((ammoId) => {
      const ammo = gameState.getAmmoById(ammoId);

      if (ammo) {
        if (ammo.dictEntity.fx?.targetReached) {
          ammo.dictEntity.fx.targetReached.forEach((effectType) => {
            fxDispatch({ type: "addFx", effectType, coordinates: ammo.position.grid });
          });
        }

        ammo.afterTargetReached(gameState);
      }
    });

  //gameDispatch({ type: "cleanupFiredAmmo" });

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
        heroWeapon.isReadyToUse(gameState) &&
        heroWeapon.getAimCoordinates()?.x === enemy.getRoundedPosition().x &&
        heroWeapon.getAimCoordinates()?.y === enemy.getRoundedPosition().y,
    );

    gameDispatch({ type: "doRandomUnitAction", unit: enemy, deltaTime });
  }
}
