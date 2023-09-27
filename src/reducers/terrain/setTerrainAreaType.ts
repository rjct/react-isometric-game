import { GameTerrain } from "@src/context/GameTerrainContext";
import { TerrainAreaType } from "@src/engine/terrain/TerrainAreaFactory";

export interface SetTerrainAreaTypeReducerAction {
  type: "setTerrainAreaType";
  entityId: string;
  areaType: TerrainAreaType;
}

export function setTerrainAreaType(state: GameTerrain, action: SetTerrainAreaTypeReducerAction): GameTerrain {
  const terrainArea = state.getTerrainAreaById(action.entityId);

  if (terrainArea) {
    terrainArea.setSourcePosition({ x1: 0, y1: 0, x2: 0, y2: 0 });
    terrainArea.setType(action.areaType);

    return { ...state };
  }

  return state;
}
