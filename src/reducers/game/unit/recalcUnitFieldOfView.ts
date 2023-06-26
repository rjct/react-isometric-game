import { GameMap } from "../../../engine/GameMap";
import { Unit } from "../../../engine/UnitFactory";

export type RecalculateUnitFieldOfViewReducerAction = {
  type: "recalculateUnitFieldOfView";
  unit: Unit;
};

export function recalculateUnitFieldOfView(state: GameMap, action: RecalculateUnitFieldOfViewReducerAction): GameMap {
  const { unit } = action;

  if (unit.isDead) {
    unit.fieldOfView.rays = [];
    return state;
  }

  const entities = [
    ...state.getEntitiesWithinRadius(unit.position, state.buildings, unit.fieldOfView.range),
    ...state.getEntitiesWithinRadius(
      unit.position,
      state.getAllAliveUnitsArray().filter((iter) => iter.id !== unit.id),
      unit.fieldOfView.range
    ),
  ];

  unit.fieldOfView.castRays(entities);

  return state;
}
