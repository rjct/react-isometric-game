import { GameTerrain } from "@src/context/GameTerrainContext";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";

export interface SetTerrainAreaExitUrlReducerAction {
  type: "setTerrainAreaExitUrl";
  entityId: string;
  exitUrl: TerrainArea["exitUrl"];
}

export function setTerrainAreaExitUrl(state: GameTerrain, action: SetTerrainAreaExitUrlReducerAction): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setExitUrl(action.exitUrl);

    return { ...state };
  }

  return state;
}
