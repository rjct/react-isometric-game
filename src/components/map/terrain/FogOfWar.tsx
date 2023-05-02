import React from "react";
import { constants } from "../../../constants";
import { useFogOfWar } from "../../../hooks/useFogOfWar";
import { useGameState } from "../../../hooks/useGameState";

export function FogOfWar() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderFogOfWar, clearFogOfWar } = useFogOfWar({ canvasRef });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  React.useEffect(() => {
    if (uiState.scene === "editor") {
      clearFogOfWar();
      return;
    }

    renderFogOfWar();
  }, [JSON.stringify(gameState.fogOfWarMatrix), uiState.scene]);

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
