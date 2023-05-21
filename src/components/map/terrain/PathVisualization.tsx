import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import { usePathVisualization } from "../../../hooks/usePathVisualization";

export function PathVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderPathVisualization } = usePathVisualization({ canvasRef });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  React.useEffect(() => {
    renderPathVisualization();
  }, [JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.position))]);

  return gameState.debug && uiState.scene === "game" ? (
    <div
      className={"path-visualization"}
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
  ) : null;
}
