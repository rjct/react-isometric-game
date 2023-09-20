import { StaticMapTerrainArea } from "@src/context/GameStateContext";
import { GameMap } from "@src/engine/GameMap";
import { TerrainArea } from "@src/engine/TerrainAreaFactory";

export interface AddTerrainAreaReducerAction {
  type: "addTerrainArea";
  entity: StaticMapTerrainArea;
}

export function addTerrainArea(state: GameMap, action: AddTerrainAreaReducerAction): GameMap {
  const terrainArea = new TerrainArea(action.entity, state.mapSize);

  state.terrain.areas.push(terrainArea);

  return {
    ...state,
    ...{
      selectedTerrainArea: terrainArea,
    },
  };
}
