import { TerrainClusterComponent } from "@src/components/viewport/layers/terrain/TerrainCluster";
import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { GameScene } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const TerrainClusters = function TerrainAreas(props: { workingScenes: GameScene[] }) {
  const { terrainState, gameState } = useGameState();
  const { checkCurrentScene } = useScene();

  const debugWireframeClass = React.useMemo(() => {
    return gameState.debug.enabled && gameState.debug.featureEnabled.wireframe ? "with-wireframe" : "";
  }, [gameState.debug.enabled, gameState.debug.featureEnabled.wireframe]);

  if (!checkCurrentScene(props.workingScenes)) return null;

  return (
    <GameLayer
      isometric={false}
      size={gameState.mapSize}
      className={["terrain-clusters", debugWireframeClass].join(" ")}
    >
      {terrainState.clustersInView.map((terrainCluster) => (
        <TerrainClusterComponent key={terrainCluster.id} terrainCluster={terrainCluster} />
      ))}
    </GameLayer>
  );
};
