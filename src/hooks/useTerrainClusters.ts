import { constants } from "@src/constants";
import { TerrainCluster } from "@src/engine/TerrainClusterFactory";
import { useGameState } from "@src/hooks/useGameState";

export function useTerrainClusters() {
  const { gameState } = useGameState();

  function composeTerrainClusters() {
    const { mapSize } = gameState;

    const clusters = {
      x: Math.ceil(mapSize.width / constants.TERRAIN_CLUSTER_SIZE.width),
      y: Math.ceil(mapSize.height / constants.TERRAIN_CLUSTER_SIZE.height),
    };

    const CLUSTER_SCREEN_SIZE: Size2D = {
      width: constants.TERRAIN_CLUSTER_SIZE.width * constants.tileSize.width,
      height: constants.TERRAIN_CLUSTER_SIZE.height * constants.tileSize.height,
    };

    const canvas = new OffscreenCanvas(CLUSTER_SCREEN_SIZE.width, CLUSTER_SCREEN_SIZE.height);
    const ctx = canvas.getContext("2d")!;

    const terrainClusters: TerrainCluster[] = [];

    for (let x = 0; x < clusters.x; x++) {
      for (let y = 0; y < clusters.y; y++) {
        const cluster = new TerrainCluster({
          canvas,
          ctx,
          gameState,
          position: {
            grid: { x, y },
          },
        });

        terrainClusters.push(cluster);
      }
    }

    return terrainClusters;
  }

  return { composeTerrainClusters };
}
