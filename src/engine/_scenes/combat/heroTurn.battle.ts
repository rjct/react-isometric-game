import { mapsList } from "@src/engine/maps_list";
import { Unit } from "@src/engine/unit/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";

export function heroTurnBattle(this: GameContext, deltaTime: number, hero: Unit) {
  const { terrainState, gameState, gameDispatch } = this;
  const heroWeapon = hero.getCurrentWeapon();
  const vehicleInUse = hero.getVehicleInUse();

  if (terrainState.isUnitIsInExitPoint(hero)) {
    const mapUrl = terrainState.getTerrainAreaByCoordinates(hero.position.grid).exitUrl! as mapsList;

    gameDispatch({ type: "updateMapUrl", mapUrl });
  }
  gameDispatch({ type: "animateUnitsMove", entities: [hero], deltaTime, consumeActionPoints: true });
  gameDispatch({
    type: "animateVehiclesMove",
    entities: vehicleInUse ? [vehicleInUse] : [],
    deltaTime,
    consumeActionPoints: true,
  });

  gameDispatch({ type: "animateFiredAmmo", deltaTime });
  gameDispatch({ type: "detectFiredAmmoHitsTarget" });

  for (const enemy of gameState.combatQueue.units) {
    // Mark enemy unit at gunpoint
    enemy.setAtGunpoint(
      !!heroWeapon &&
        heroWeapon.isReadyToUse(gameState) &&
        heroWeapon.getAimCoordinates()?.x === enemy.getRoundedPosition().x &&
        heroWeapon.getAimCoordinates()?.y === enemy.getRoundedPosition().y,
    );
  }
}
