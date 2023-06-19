import { GameMap } from "../../../engine/GameMap";
import { Building } from "../../../engine/BuildingFactory";

export interface AddBuildingReducerAction {
  type: "addBuilding";
  buildingType: Building["type"];
  position: GridCoordinates;
  direction: Building["direction"];
  variant: Building["variant"];
}

export function addBuilding(state: GameMap, action: AddBuildingReducerAction): GameMap {
  const building = new Building({
    buildingType: action.buildingType,
    position: action.position,
    direction: action.direction,
    variant: action.variant,
  });

  state.buildings.push(building);

  return {
    ...state,
    ...{
      matrix: state.setGridMatrixOccupancy([building], state.matrix),
      selectedBuilding: building,
    },
  };
}
