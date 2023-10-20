import { GameMap } from "@src/engine/gameMap";

export type RecalculateUnitFieldOfViewReducerAction = {
  type: "recalculateUnitFieldOfView";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateUnitFieldOfView(state: GameMap, action: RecalculateUnitFieldOfViewReducerAction): GameMap {
  const units = state.getAllAliveUnitsArray();
  const buildings = state.buildings.filter((building) => building.occupiesCell);

  for (const unit of units) {
    if (unit.isDead || unit.fieldOfView.rays.length === 0 || unit.distanceToHero > unit.fieldOfView.range) {
      continue;
    }

    unit.fieldOfView.castRays([
      ...state.getEntitiesWithinRadius(unit.position.grid, buildings, unit.fieldOfView.range),
      ...state.getEntitiesWithinRadius(
        unit.position.grid,
        units.filter((iter) => iter.id !== unit.id),
        unit.fieldOfView.range,
      ),
    ]);
  }

  return state;
}
