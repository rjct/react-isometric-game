import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";
import { mapsList } from "../maps_list";

export type DetectHeroOnExitPointsAction = {
  type: "detectHeroOnExitPoints";
  unit: Unit;
};

export function detectHeroOnExitPoints(state: GameMap, action: DetectHeroOnExitPointsAction): GameMap {
  if (action.unit && state.isUnitIsInExitPoint(action.unit)) {
    const mapUrl = state.getTerrainAreaByCoordinates(action.unit.position).exitUrl! as mapsList;

    return { ...state, ...{ mapUrl } };
  }

  return state;
}
