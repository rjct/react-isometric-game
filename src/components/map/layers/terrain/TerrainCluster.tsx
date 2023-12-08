import { constants } from "@src/engine/constants";
import { TerrainCluster } from "@src/engine/terrain/TerrainClusterFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainClusterComponent = (props: { terrainCluster: TerrainCluster }) => {
  const { terrainState, gameState } = useGameState();

  const [bg, setBg] = React.useState(props.terrainCluster.getBg());

  React.useEffect(() => {
    if (props.terrainCluster.getBg() === "") {
      props.terrainCluster.render(terrainState, gameState).then((bg) => {
        setBg(bg);
      });
    }
  }, [props.terrainCluster.getBg()]);

  if (bg === "") return null;

  return (
    <div
      className={"terrain-cluster"}
      style={{
        transform: `translate3d(${props.terrainCluster.position.screen.x}px, ${props.terrainCluster.position.screen.y}px, 0)`,
        width: constants.TERRAIN_CLUSTER_SIZE.screen.width,
        height: constants.TERRAIN_CLUSTER_SIZE.screen.height,
        backgroundImage: `url(${bg})`,
      }}
    ></div>
  );
};
