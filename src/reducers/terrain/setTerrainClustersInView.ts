import { GameTerrain } from "@src/context/GameTerrainContext";

export type SetTerrainClustersInViewReducerAction = {
  type: "setTerrainClustersInView";
  clustersInView: GameTerrain["clustersInView"];
};

export function setTerrainClustersInView(
  state: GameTerrain,
  action: SetTerrainClustersInViewReducerAction,
): GameTerrain {
  return {
    ...state,
    ...{
      clustersInView: action.clustersInView,
    },
  };
}
