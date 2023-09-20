import { GameMap } from "@src/engine/GameMap";

export type CreateTerrainClustersReducerAction = {
  type: "createTerrainClusters";
  terrainClusters: GameMap["terrain"]["clusters"];
};

export function createTerrainClusters(state: GameMap, action: CreateTerrainClustersReducerAction): GameMap {
  return {
    ...state,
    ...{
      terrain: {
        areas: state.terrain.areas,
        clusters: action.terrainClusters,
      },
    },
  };
}
