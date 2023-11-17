import { mapsList } from "@src/engine/maps_list";
import { GameContext } from "@src/hooks/useGameState";

export function gameScene(this: GameContext, deltaTime: number) {
  const { terrainState, gameState, gameDispatch, uiState } = this;

  const allAliveUnits = gameState.getAllAliveUnitsArray();
  const allAliveEnemies = gameState.getAliveEnemiesArray();
  const hero = gameState.units[gameState.heroId];

  // User Input
  // if (isBrowser) {
  //   uiDispatch({ type: "scrollMapOnScreenEdges", deltaTime });
  // }

  // Update
  if (hero && terrainState.isUnitIsInExitPoint(hero)) {
    const mapUrl = terrainState.getTerrainAreaByCoordinates(hero.position.grid).exitUrl! as mapsList;

    gameDispatch({ type: "beforeUpdateMapUrl" });
    gameDispatch({ type: "updateMapUrl", mapUrl });
  }

  gameDispatch({ type: "animateUnitsMove", entities: allAliveUnits, deltaTime });
  gameDispatch({ type: "animateVehiclesMove", entities: gameState.vehicles, deltaTime });
  gameDispatch({ type: "animateFiredAmmo", deltaTime });

  gameState.ammoFiredIds
    .filter((ammoId) => gameState.getAmmoById(ammoId)?.isTargetReached)
    .forEach((ammoId) => {
      const ammo = gameState.getAmmoById(ammoId);

      if (ammo) {
        if (ammo.dictEntity.vfx?.targetReached) {
          ammo.dictEntity.vfx.targetReached.type.forEach((effectType) => {
            gameDispatch({
              type: "emitVfx",
              effectType,
              animationDuration: ammo.dictEntity.vfx!.targetReached.animationDuration!,
              coordinates: ammo.targetPosition.grid,
              light: ammo.dictEntity.vfx?.targetReached.light,
            });
          });
        }

        ammo.afterTargetReached(gameState);
      }
    });

  gameDispatch({ type: "detectFiredAmmoHitsTarget" });

  for (const unit of allAliveUnits) {
    gameDispatch({
      type: "recalculateUnitDistanceToScreenCenter",
      unit,
      viewport: uiState.viewport,
      scroll: uiState.scroll,
    });
  }

  for (const vfx of this.gameState.visualEffects) {
    if (vfx.lightEffect && vfx.isLightAnimationCompleted()) {
      gameDispatch({ type: "deleteLight", entityId: vfx.lightEffect.light.id });
    }

    if (vfx.isAnimationCompleted() && vfx.isLightAnimationCompleted()) {
      gameDispatch({ type: "deleteVfx", id: vfx.id });
    }

    if (vfx.lightEffect) {
      gameDispatch({
        type: "setLightRadius",
        entityId: vfx.lightEffect.light.id,
        radius: vfx.lightEffect.light.radius + deltaTime * vfx.lightEffect.animationRadiusMultiplier,
      });
    }

    vfx.update(gameState, deltaTime);
  }

  for (const enemy of allAliveEnemies) {
    gameDispatch({ type: "highlightUnitAtGunpoint", unit: enemy });
    gameDispatch({ type: "doRandomUnitAction", unit: enemy, deltaTime });
  }

  for (const vehicle of gameState.vehicles) {
    gameDispatch({ type: "accelerateVehicle", vehicle, deltaTime });
    gameDispatch({ type: "decelerateVehicle", vehicle, deltaTime });
    //gameDispatch({ type: "animateVehicleMove", vehicle, deltaTime });
  }
}
