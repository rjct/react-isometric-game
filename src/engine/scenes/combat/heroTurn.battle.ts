import { Unit } from "@src/engine/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";
import { mapsList } from "@src/maps_list";

export function heroTurnBattle(this: GameContext, deltaTime: number, hero: Unit) {
  const { terrainState, gameState, gameDispatch } = this;
  const heroWeapon = hero.getCurrentWeapon();

  if (terrainState.isUnitIsInExitPoint(hero)) {
    const mapUrl = terrainState.getTerrainAreaByCoordinates(hero.position).exitUrl! as mapsList;

    gameDispatch({ type: "updateMapUrl", mapUrl });
  }
  gameDispatch({ type: "animateUnitMove", units: [hero], deltaTime, consumeActionPoints: true });

  gameDispatch({ type: "animateFiredAmmo", weapon: heroWeapon, deltaTime });
  gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon: heroWeapon });
  gameDispatch({ type: "cleanupFiredAmmo", weapon: heroWeapon });

  for (const enemy of gameState.combatQueue.units) {
    // Mark enemy unit at gunpoint
    enemy.setAtGunpoint(
      !!heroWeapon &&
        heroWeapon.isReadyToUse() &&
        heroWeapon.getAimCoordinates()?.x === enemy.getRoundedPosition().x &&
        heroWeapon.getAimCoordinates()?.y === enemy.getRoundedPosition().y,
    );
  }
}
