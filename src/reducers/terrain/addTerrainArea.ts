import { StaticMapTerrainArea } from "@src/context/GameStateContext";
import { GameTerrain } from "@src/context/GameTerrainContext";
import { GameMap } from "@src/engine/gameMap";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";

export interface AddTerrainAreaReducerAction {
  type: "addTerrainArea";
  entity: StaticMapTerrainArea;
  mapSize: GameMap["mapSize"];
}

export function addTerrainArea(state: GameTerrain, action: AddTerrainAreaReducerAction): GameTerrain {
  const terrainArea = new TerrainArea(action.entity, action.mapSize);

  state.areas.push(terrainArea);

  return {
    ...state,
    ...{
      selectedTerrainArea: terrainArea,
    },
  };
}
