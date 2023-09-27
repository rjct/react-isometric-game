import { constants } from "@src/engine/constants";
import { StaticMap } from "@src/context/GameStateContext";
import { GameTerrain } from "@src/context/GameTerrainContext";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { TerrainCluster } from "@src/engine/terrain/TerrainClusterFactory";

export type SwitchTerrainMapReducerAction = {
  type: "switchMap";
  map: StaticMap;
  mediaFiles: MediaAssets;
};

export function switchMap(state: GameTerrain, action: SwitchTerrainMapReducerAction): GameTerrain {
  const newState = {
    ...state,
    ...{
      areas: [] as TerrainArea[],
      clusters: [] as TerrainCluster[],
    },
  };

  newState.areas = action.map.terrain.map((terrainArea) => {
    return new TerrainArea(terrainArea, action.map.size);
  });

  //
  const clusters = {
    x: Math.ceil(action.map.size.width / constants.TERRAIN_CLUSTER_SIZE.grid.width),
    y: Math.ceil(action.map.size.height / constants.TERRAIN_CLUSTER_SIZE.grid.height),
  };

  const canvas = new OffscreenCanvas(
    constants.TERRAIN_CLUSTER_SIZE.screen.width,
    constants.TERRAIN_CLUSTER_SIZE.screen.height,
  );
  const ctx = canvas.getContext("2d")!;

  for (let x = 0; x < clusters.x; x++) {
    for (let y = 0; y < clusters.y; y++) {
      const cluster = new TerrainCluster({
        canvas,
        ctx,
        position: {
          grid: { x, y },
        },
      });

      newState.clusters.push(cluster);
    }
  }

  return newState;
}
