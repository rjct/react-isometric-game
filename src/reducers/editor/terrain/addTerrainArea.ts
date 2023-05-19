import { GameMap } from "../../../engine/GameMap";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";
import { StaticMapTerrainArea } from "../../../context/GameStateContext";

export interface AddTerrainAreaReducerAction {
  type: "addTerrainArea";
  entity: StaticMapTerrainArea;
}

export function addTerrainArea(state: GameMap, action: AddTerrainAreaReducerAction): GameMap {
  const terrainArea = new TerrainArea(action.entity);

  state.terrain.push(terrainArea);

  return {
    ...state,
    ...{
      selectedTerrainArea: terrainArea,
    },
  };
}
