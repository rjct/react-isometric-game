import { GameMap } from "../../../engine/GameMap";
import { TerrainArea } from "../../../engine/TerrainAreaFactory";

export interface SetTerrainAreaExitUrlReducerAction {
  type: "setTerrainAreaExitUrl";
  entityId: string;
  exitUrl: TerrainArea["exitUrl"];
}

export function setTerrainAreaExitUrl(state: GameMap, action: SetTerrainAreaExitUrlReducerAction): GameMap {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setExitUrl(action.exitUrl);

    return { ...state };
  }

  return state;
}
