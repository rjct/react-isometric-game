import { GameTerrain } from "@src/context/GameTerrainContext";
import { GameMap } from "@src/engine/gameMap";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";

export interface CloneSelectedTerrainAreaReducerAction {
  type: "cloneSelectedTerrainArea";
  entityId: string;
  mapSize: GameMap["mapSize"];
}

export function cloneSelectedTerrainArea(
  state: GameTerrain,

  action: CloneSelectedTerrainAreaReducerAction,
): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    const newTerrainArea = new TerrainArea(terrainArea.getJSON(), action.mapSize);

    state.areas.push(newTerrainArea);

    return {
      ...state,
      ...{
        selectedTerrainArea: newTerrainArea,
      },
    };
  }

  return state;
}
