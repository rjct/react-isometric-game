import React from "react";
import { constants } from "../../../constants";
import { Tile } from "./Tile";
import { useGameState } from "../../../hooks/useGameState";

export const TerrainTiles = React.memo(function TerrainTiles() {
  const { gameState, uiState } = useGameState();
  const [viewport, setViewport] = React.useState(uiState.viewport);

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const tiles: Array<Array<React.ReactElement>> = [];

  for (let y = 0; y < gameState.matrix.length; y++) {
    if (!tiles[y]) tiles[y] = [];

    for (let x = 0; x < gameState.matrix[y].length; x++) {
      const tile = gameState.tiles[y][x];

      tiles[y][x] = gameState.isTileInViewport(tile, viewport) ? (
        <Tile key={`${x}:${y}`} tile={tile} isActive={false} isOccupied={false} exitPoint={tile.exitPoint} />
      ) : (
        (null as unknown as React.ReactElement)
      );
    }
  }

  React.useEffect(
    function onViewportChanged() {
      setViewport(uiState.viewport);
    },
    [uiState.viewport]
  );

  return (
    <div
      className={["terrain", gameState.terrain.className].join(" ")}
      style={{ width: mapWidth * tileWidth, height: mapHeight * tileHeight }}
    >
      {tiles}
    </div>
  );
});
