import { BuildingType } from "@src/dict/building/building";
import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";

export interface AddBuildingReducerAction {
  type: "addBuilding";
  buildingType: BuildingType;
  position: GridCoordinates;
  rotation: AngleInDegrees;
  variant: Building["variant"];
}

export function addBuilding(state: GameMap, action: AddBuildingReducerAction): GameMap {
  const building = new Building({
    gameState: state,
    buildingType: action.buildingType,
    position: action.position,
    rotation: action.rotation,
    variant: action.variant,
    occupiesCell: true,
  });

  building.setPosition(action.position, state);

  state.buildings.push(building);
  state.setGridMatrixOccupancy([building]);

  return {
    ...state,
    ...{
      selectedBuilding: building,
    },
  };
}
