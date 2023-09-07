import { Unit } from "@src/engine/UnitFactory";
import { GameContext } from "@src/hooks/useGameState";

export function heroTurnBattle(this: GameContext, deltaTime: number, hero: Unit) {
  const { gameState, gameDispatch } = this;
  const heroWeapon = hero.getCurrentWeapon();

  gameDispatch({ type: "detectHeroOnExitPoints", unit: hero });
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
