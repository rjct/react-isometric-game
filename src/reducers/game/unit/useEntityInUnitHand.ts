import { GameMap } from "@src/engine/gameMap";
import { getAngleBetweenTwoGridPoints } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface UseEntityInUnitHandReducerAction {
  type: "useEntityInUnitHand";
  unit: Unit;
  hand: Exclude<keyof Unit["inventory"], "main">;
  targetPosition: GridCoordinates;
  consumeActionPoints?: boolean;
}

export function useEntityInUnitHand(state: GameMap, action: UseEntityInUnitHandReducerAction) {
  const { unit, hand, targetPosition, consumeActionPoints } = action;

  unit.setRotation(getAngleBetweenTwoGridPoints(targetPosition, unit.position.grid));

  const weapon = unit.getCurrentWeapon();

  if (weapon && weapon.isReadyToUse(state)) {
    unit.inventory[hand]?.use(targetPosition, state);

    if (consumeActionPoints) {
      unit.consumeActionPoints(weapon.getCurrentAttackModeDetails().actionPointsConsumption);
    }
  }

  return { ...state };
}
