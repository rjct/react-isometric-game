import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import { useDebugVisualization } from "../../../hooks/debug/useDebugVisualization";

export function DebugVisualization() {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const { gameState, uiState } = useGameState();
  const { renderDebugVisualization } = useDebugVisualization({ canvasRef });

  const tileWidth = constants.tileSize.width;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  React.useEffect(() => {
    renderDebugVisualization();
  }, [
    //
    JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.position)),
    uiState.mousePosition.grid,
  ]);

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
