import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";

export const TerrainTiles = React.memo(function TerrainTiles() {
  const { gameState, uiState } = useGameState();

  const canvasRef = React.createRef<HTMLCanvasElement>();

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const renderTerrainTiles = () => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);

      for (let y = 0; y < gameState.matrix.length; y++) {
        for (let x = 0; x < gameState.matrix[y].length; x++) {
          const tile = gameState.tiles[y][x];

          if (tile.sprite) {
            if (tile.exitPoint) {
              ctx.filter = "hue-rotate(90deg)";
            }

            ctx.drawImage(
              gameState.mediaFiles[tile.sprite.url]?.img ?? new Image(),
              tileWidth * (tile.sprite?.x || 0) + (tile.sprite?.x || 0) * 3 + 1,
              tileHeight * (tile.sprite?.y || 0) + (tile.sprite?.y || 0) * 3 + 1,
              tileWidth,
              tileHeight,
              tile.position.screen.x,
              tile.position.screen.y,
              tileWidth,
              tileHeight
            );

            if (tile.exitPoint) {
              ctx.filter = "none";
            }
          }
        }
      }
    }
  };

  React.useEffect(() => {
    renderTerrainTiles();
  }, [
    gameState.mapSize,
    gameState.mapUrl,
    gameState.terrain,
    //
    uiState.scene,
  ]);

  return (
    <div
      className={"terrain"}
      style={{
        width: mapWidth * tileWidth + (uiState.scene === "editor" ? constants.editor.width : 0),
        height: mapHeight * tileHeight,
      }}
    >
      <canvas
        ref={canvasRef}
        width={`${mapWidth * tileWidth + (uiState.scene === "editor" ? constants.editor.width : 0)}`}
        height={`${mapHeight * tileHeight}`}
      ></canvas>
    </div>
  );
});
