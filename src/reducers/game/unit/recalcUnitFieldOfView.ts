import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type RecalculateUnitFieldOfViewReducerAction = {
  type: "recalculateUnitFieldOfView";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recalculateUnitFieldOfView(state: GameMap, action: RecalculateUnitFieldOfViewReducerAction): GameMap {
  const units = state.getAllAliveUnitsArray();

  for (const unit of units) {
    if (unit.fieldOfView.rays.length === 0 || unit.distanceToHero > unit.fieldOfView.range) {
      continue;
    }

    const entitiesInView: { [id: string]: Building | Unit | Vehicle } = {};

    for (const coordinates of unit.fieldOfView.cellsInView) {
      const entity = state.getEntityByCoordinates(coordinates);

      if (entity && entity.id !== unit.id) {
        entitiesInView[entity.id] = entity;
      }
    }

    unit.fieldOfView.castRays(Object.values(entitiesInView));
  }

  return state;
}
