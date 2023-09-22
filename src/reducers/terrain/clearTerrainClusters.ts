import { GameTerrain } from "@src/context/GameTerrainContext";

export type ClearTerrainClustersReducerAction = {
  type: "clearTerrainClusters";
  clusters: GameTerrain["clustersInView"];
};

export function clearTerrainClusters(state: GameTerrain, action: ClearTerrainClustersReducerAction): GameTerrain {
  action.clusters.forEach((cluster) => {
    cluster.clear();
  });

  return { ...state, ...{ clusters: action.clusters } };
}
