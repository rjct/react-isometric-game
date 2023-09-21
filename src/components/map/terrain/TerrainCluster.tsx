import { constants } from "@src/constants";
import { TerrainCluster } from "@src/engine/TerrainClusterFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainClusterComponent = React.memo((props: { terrainCluster: TerrainCluster }) => {
  const { terrainState, gameState } = useGameState();

  React.useEffect(() => {
    if (props.terrainCluster.bg === "") {
      props.terrainCluster.render(terrainState, gameState);
    }
  }, []);

  if (props.terrainCluster.bg === "") return null;

  return (
    <div
      className={"terrain-cluster"}
      style={{
        transform: `translate3d(${props.terrainCluster.position.screen.x}px, ${props.terrainCluster.position.screen.y}px, 0)`,
        width: constants.TERRAIN_CLUSTER_SIZE.screen.width,
        height: constants.TERRAIN_CLUSTER_SIZE.screen.height,
        backgroundImage: `url(${props.terrainCluster.bg})`,
      }}
    ></div>
  );
});
