import React from "react";
import { constants } from "../../../constants";
import { Tile } from "./Tile";
import { useGameState } from "../../../hooks/useGameState";
import { useDebounce } from "../../../hooks/useDebounce";
import { useHero } from "../../../hooks/useHero";

export const WireframeTiles = React.memo(function WireframeTiles() {
  const { gameState, uiState } = useGameState();
  const { hero, highlightHeroPath, highlightTargetWireframeCell } = useHero();
  const [viewport, setViewport] = React.useState(uiState.viewport);

  const debouncedMousePosition = useDebounce(uiState.mousePosition, 500);

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;
  const tileWidth = constants.tileSize.width;
  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const wireframe: Array<Array<React.ReactElement>> = [];

  for (let y = 0; y < gameState.matrix.length; y++) {
    if (!wireframe[y]) wireframe[y] = [];

    for (let x = 0; x < gameState.matrix[y].length; x++) {
      const wireframeItem = gameState.wireframe[y][x];

      wireframe[y][x] = gameState.isTileInViewportIsometric(wireframeItem, viewport) ? (
        <Tile
          key={`${x}:${y}`}
          tile={wireframeItem}
          isActive={wireframeItem.isActive}
          isOccupied={gameState.debug ? gameState.isCellOccupied(x, y) : false}
          value={wireframeItem.value}
          direction={wireframeItem.direction}
          style={wireframeItem.style}
        />
      ) : (
        (null as unknown as React.ReactElement)
      );
    }
  }

  React.useEffect(() => {
    setViewport(uiState.viewport);
  }, [uiState.viewport]);

  React.useEffect(() => {
    if (hero.isUsingHands()) return;
    highlightHeroPath();
  }, [debouncedMousePosition]);

  React.useEffect(() => {
    if (hero.isUsingHands()) {
      highlightTargetWireframeCell();
    }
  }, [uiState.mousePosition]);

  return (
    <>
      <div
        className={"wireframe"}
        style={{
          width: mapWidth * wireframeTileWidth,
          height: mapHeight * wireframeTileHeight,
          left: (mapWidth * tileWidth) / 2,
        }}
      >
        {wireframe}
      </div>
    </>
  );
});
