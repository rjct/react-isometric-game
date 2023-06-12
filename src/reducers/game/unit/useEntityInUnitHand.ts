import { Unit } from "../../../engine/UnitFactory";
import { GameMap } from "../../../engine/GameMap";
import { getAngleBetweenTwoGridPoints } from "../../../engine/helpers";

export interface UseEntityInUnitHandReducerAction {
  type: "useEntityInUnitHand";
  unit: Unit;
  hand: Exclude<keyof Unit["inventory"], "backpack">;
  targetPosition: GridCoordinates;
}

export function useEntityInUnitHand(state: GameMap, action: UseEntityInUnitHandReducerAction) {
  action.unit.setDirection(getAngleBetweenTwoGridPoints(action.targetPosition, action.unit.position).deg);

  const weapon = action.unit.getCurrentWeapon();

  if (weapon) {
    action.unit.inventory[action.hand]?.use(action.targetPosition);
  }

  return { ...state };
}
