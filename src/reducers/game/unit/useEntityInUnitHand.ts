import { Unit } from "../../../engine/UnitFactory";
import { GameMap } from "../../../engine/GameMap";

export interface UseEntityInUnitHandReducerAction {
  type: "useEntityInUnitHand";
  unit: Unit;
  hand: Exclude<keyof Unit["inventory"], "backpack">;
  targetPosition: GridCoordinates;
}

export function useEntityInUnitHand(state: GameMap, action: UseEntityInUnitHandReducerAction) {
  action.unit.setDirection(
    Math.atan2(action.targetPosition.y - action.unit.position.y, action.targetPosition.x - action.unit.position.x) *
      (180 / Math.PI)
  );

  const weapon = action.unit.getCurrentWeapon();

  if (weapon) {
    action.unit.inventory[action.hand]?.use(action.targetPosition);
  }

  return { ...state };
}
