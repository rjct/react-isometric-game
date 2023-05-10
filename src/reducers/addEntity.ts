import { GameMap } from "../engine/GameMap";
import { Building, DictBuilding } from "../engine/BuildingFactory";

export interface AddEntityReducerAction {
  type: "addEntity";
  entity: DictBuilding;
  position: Coordinates;
  direction: Building["direction"];
  variant: Building["variant"];
}

export function addEntity(state: GameMap, action: AddEntityReducerAction): GameMap {
  const building = new Building({
    buildingType: action.entity.type,
    position: action.position,
    direction: action.direction,
    variant: action.variant,
  });

  state.buildings.push(building);

  return {
    ...state,
    ...{
      matrix: state.setGridMatrixOccupancy([building], state.matrix),
      selectedEntity: building,
    },
  };
}
