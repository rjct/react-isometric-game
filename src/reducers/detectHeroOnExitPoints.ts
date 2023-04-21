import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";

export type DetectHeroOnExitPointsAction = {
  type: "detectHeroOnExitPoints";
  unit: Unit;
};

export function detectHeroOnExitPoints(state: typeof GameMap, action: DetectHeroOnExitPointsAction) {
  if (action.unit.id === state.heroId && state.isUnitIsInExitPoint(action.unit)) {
    const mapUrl = state.getTileByCoordinates(action.unit.position).exitPoint as string;

    return { ...state, ...{ mapUrl } };
  }

  return state;
}
