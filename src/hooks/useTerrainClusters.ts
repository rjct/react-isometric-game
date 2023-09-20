import { constants } from "@src/constants";
import { TerrainCluster } from "@src/engine/TerrainClusterFactory";
import { useGameState } from "@src/hooks/useGameState";

export function useTerrainClusters() {
  const { gameState } = useGameState();

  function composeTerrainClusters() {
    const { mapSize } = gameState;

    const clusters = {
      x: Math.ceil(mapSize.width / constants.TERRAIN_CLUSTER_SIZE.grid.width),
      y: Math.ceil(mapSize.height / constants.TERRAIN_CLUSTER_SIZE.grid.height),
    };

    const canvas = new OffscreenCanvas(
      constants.TERRAIN_CLUSTER_SIZE.screen.width,
      constants.TERRAIN_CLUSTER_SIZE.screen.height,
    );
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
