import { GameContext } from "../../../hooks/useGameState";
import { Unit } from "../../UnitFactory";
import { Weapon } from "../../weapon/WeaponFactory";
import { enemyTurnNoActionPoints } from "./enemyTurn.noActionPoints";

export function enemyTurnBattle(
  this: GameContext,
  deltaTime: number,
  enemy: Unit,
  weapon: {
    hand: Exclude<keyof Unit["inventory"], "backpack">;
    weapon: Weapon;
  }
) {
  const { gameState, gameDispatch } = this;
  const hero = gameState.getHero();

  if (weapon.weapon.actionPointsConsumption > enemy.actionPoints.current) {
    return enemyTurnNoActionPoints.apply(this, [deltaTime, enemy]);
  }

  weapon.weapon.aimAt(hero.getRoundedPosition());

  gameDispatch({ type: "setCurrentUnitAction", unit: enemy, selectedAction: weapon.hand });

  gameDispatch({
    type: "useEntityInUnitHand",
    unit: enemy,
    hand: enemy.currentSelectedAction as Exclude<keyof Unit["inventory"], "backpack">,
    targetPosition: hero.getRoundedPosition(),
    consumeActionPoints: true,
  });

  gameDispatch({ type: "animateFiredAmmo", weapon: weapon.weapon, deltaTime });
  gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon: weapon.weapon });
  gameDispatch({ type: "cleanupFiredAmmo", weapon: weapon.weapon });
}
