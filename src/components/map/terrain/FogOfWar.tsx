import React from "react";
import { constants } from "../../../constants";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { useGameState } from "../../../hooks/useGameState";

export function FogOfWar() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState } = useGameState();
  const { renderFogOfWar } = useFogOfWar({ canvasRef });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  React.useEffect(() => {
    renderFogOfWar();
  }, [JSON.stringify(gameState.fogOfWarMatrix)]);

  return (
    <div
      className={"fow"}
      style={{
        width: mapWidth * wireframeTileWidth,
        height: mapHeight * wireframeTileHeight,
        left: (mapWidth * tileWidth) / 2,
      }}
    >
      <canvas
        ref={canvasRef}
        width={`${mapWidth * wireframeTileWidth}`}
        height={`${mapHeight * wireframeTileHeight}`}
      ></canvas>
    </div>
  );
}
