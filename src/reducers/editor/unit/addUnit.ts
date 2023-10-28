import { StaticMapUnit } from "@src/context/GameStateContext";
import { GameMap } from "@src/engine/gameMap";
import { Unit, UnitType } from "@src/engine/unit/UnitFactory";

export interface AddUnitReducerAction {
  type: "addUnit";
  unitType: UnitType;
  position: GridCoordinates;
  rotation: AngleInDegrees;
  inventory?: StaticMapUnit["inventory"];
}

export function addUnit(state: GameMap, action: AddUnitReducerAction): GameMap {
  const unit = new Unit({
    gameState: state,
    unitType: action.unitType,
    position: action.position,
    rotation: action.rotation,
    inventory: action.inventory,
    isHero: false,
  });

  unit.setPosition(action.position, state);

  state.units[unit.id] = unit;
  state.setGridMatrixOccupancy([unit]);

  return {
    ...state,
    ...{
      selectedUnit: unit,
    },
  };
}
