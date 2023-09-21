import { MapLayer } from "@src/components/map/MapLayer";
import { TerrainClusterComponent } from "@src/components/map/terrain/TerrainCluster";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainClusters = React.memo(function TerrainAreas() {
  const { terrainState, gameState } = useGameState();

  const debugWireframeClass = React.useMemo(() => {
    return gameState.debug.enabled && gameState.debug.featureEnabled.wireframe ? "with-wireframe" : "";
  }, [gameState.debug.enabled, gameState.debug.featureEnabled.wireframe]);

  return (
    <MapLayer
      isometric={false}
      size={gameState.mapSize}
      className={["terrain-clusters", debugWireframeClass].join(" ")}
    >
      {terrainState.clustersInView.map((terrainCluster) => (
        <TerrainClusterComponent key={terrainCluster.id} terrainCluster={terrainCluster} />
      ))}
    </MapLayer>
  );
});
