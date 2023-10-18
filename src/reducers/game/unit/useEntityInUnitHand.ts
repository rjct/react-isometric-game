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
  action.unit.setDirection(getAngleBetweenTwoGridPoints(action.targetPosition, action.unit.position.grid));

  const weapon = action.unit.getCurrentWeapon();

  if (weapon && weapon.isReadyToUse(state)) {
    action.unit.inventory[action.hand]?.use(action.targetPosition, state);

    if (action.consumeActionPoints) {
      action.unit.consumeActionPoints(weapon.getCurrentAttackModeDetails().actionPointsConsumption);
    }
  }

  return { ...state };
}
