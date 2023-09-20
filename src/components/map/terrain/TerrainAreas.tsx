import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/constants";
import { useGameState } from "@src/hooks/useGameState";
import { useTerrainClusters } from "@src/hooks/useTerrainClusters";
import React from "react";

export const TerrainAreas = React.memo(function TerrainAreas() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { composeTerrainClusters } = useTerrainClusters();

  const terrainClusters = React.useMemo(() => {
    return gameState.terrain.clusters.filter((terrainCluster) => {
      const { x1, y1, x2, y2 } = uiState.viewport.screen;

      return (
        terrainCluster.position.screen.x + constants.TERRAIN_CLUSTER_SIZE.screen.width >= x1 &&
        terrainCluster.position.screen.x <= x2 &&
        terrainCluster.position.screen.y <= y2 &&
        terrainCluster.position.screen.y + constants.TERRAIN_CLUSTER_SIZE.screen.height >= y1
      );
    });
  }, [
    uiState.viewport.grid,
    gameState.terrain.clusters.length,
    uiState.scene === "editor" ? gameState.getTerrainClustersHash() : false,
  ]);

  React.useEffect(() => {
    if (gameState.mapSize.width === 0 || gameState.mapSize.height === 0) return;

    console.time("createTerrainClusters");
    gameDispatch({ type: "createTerrainClusters", terrainClusters: composeTerrainClusters() });
    console.timeEnd("createTerrainClusters");
  }, [gameState.mapSize, uiState.scene === "editor" ? gameState.getTerrainHash() : false]);

  return (
    <MapLayer isometric={false} size={gameState.mapSize} className={"terrain-clusters"}>
      {terrainClusters.map((terrainCluster) => {
        return (
          <div
            key={terrainCluster.id}
            className={"terrain-cluster"}
            style={{
              transform: `translate3d(${terrainCluster.position.screen.x}px, ${terrainCluster.position.screen.y}px, 0)`,
              width: constants.TERRAIN_CLUSTER_SIZE.screen.width,
              height: constants.TERRAIN_CLUSTER_SIZE.screen.height,
              backgroundImage: `url(${terrainCluster.bg})`,
            }}
          ></div>
        );
        //return terrainCluster.element;
      })}
    </MapLayer>
  );
});
