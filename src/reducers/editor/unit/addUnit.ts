import { GameMap } from "../../../engine/GameMap";
import { Unit, UnitType } from "../../../engine/UnitFactory";

export interface AddUnitReducerAction {
  type: "addUnit";
  unitType: UnitType;
  position: GridCoordinates;
}

export function addUnit(state: GameMap, action: AddUnitReducerAction): GameMap {
  const unit = new Unit({
    unitType: action.unitType,
    position: action.position,
  });

  unit.setPosition(action.position, state);

  state.units[unit.id] = unit;

  return {
    ...state,
    ...{
      matrix: state.setGridMatrixOccupancy([unit], state.matrix),
      selectedUnit: unit,
    },
  };
}
