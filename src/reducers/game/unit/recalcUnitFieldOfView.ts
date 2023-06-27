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

  const buildings = state.buildings.filter((building) => state.isEntityVisible(building));

  const allAliveUnits = state
    .getAllAliveUnitsArray()
    .filter((iter) => iter.id !== unit.id && state.isEntityVisible(iter));

  const entities = [
    ...state.getEntitiesWithinRadius(unit.position, buildings, unit.fieldOfView.range),
    ...state.getEntitiesWithinRadius(unit.position, allAliveUnits, unit.fieldOfView.range),
  ];

  unit.fieldOfView.castRays(entities);

  return state;
}
