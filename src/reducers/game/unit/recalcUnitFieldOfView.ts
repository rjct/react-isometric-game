import { GameMap } from "@src/engine/gameMap";

export type RecalculateUnitFieldOfViewReducerAction = {
  type: "recalculateUnitFieldOfView";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateUnitFieldOfView(state: GameMap, action: RecalculateUnitFieldOfViewReducerAction): GameMap {
  const units = state.getAllAliveUnitsArray();

  for (const unit of units) {
    if (unit.isDead || unit.fieldOfView.rays.length === 0 || unit.distanceToHero > unit.fieldOfView.range) {
      continue;
    }

    const buildings = state.buildings.filter((building) => building.occupiesCell && state.isEntityVisible(building));

    const allAliveUnits = state
      .getAllAliveUnitsArray()
      .filter((iter) => iter.id !== unit.id && state.isEntityVisible(iter));

    unit.fieldOfView.castRays([
      ...state.getEntitiesWithinRadius(unit.position.grid, buildings, unit.fieldOfView.range),
      ...state.getEntitiesWithinRadius(unit.position.grid, allAliveUnits, unit.fieldOfView.range),
    ]);
  }

  return state;
}
