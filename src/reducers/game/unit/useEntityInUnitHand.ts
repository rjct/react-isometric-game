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
  action.unit.setDirection(getAngleBetweenTwoGridPoints(action.targetPosition, action.unit.position).deg);

  const weapon = action.unit.getCurrentWeapon();

  if (weapon && weapon.isReadyToUse()) {
    action.unit.inventory[action.hand]?.use(action.targetPosition);

    if (action.consumeActionPoints) {
      action.unit.consumeActionPoints(weapon.actionPointsConsumption);
    }
  }

  return { ...state };
}
