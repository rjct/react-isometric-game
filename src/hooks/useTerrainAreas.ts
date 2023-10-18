import { GameTerrain } from "@src/context/GameTerrainContext";
import { GameUI } from "@src/context/GameUIContext";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { gridToScreenSpace } from "@src/engine/helpers";
import { useEditor } from "@src/hooks/useEditor";

export function useTerrainAreas(terrainState: GameTerrain, gameState: GameMap, uiState: GameUI) {
  const { getEditorLibraryPosition } = useEditor();

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const entityLibraryWidth = getEditorLibraryPosition();

  const renderTerrainTiles = (ctx: CanvasRenderingContext2D) => {
    if (!ctx) return;

    ctx.resetTransform();
    ctx.clearRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);
    ctx.setTransform(1, 0, 0, 1, -uiState.scroll.x + entityLibraryWidth, -uiState.scroll.y);

    Object.values(uiState.viewport.visibleCells).forEach((coordinates) => {
      const terrainTile = terrainState.getTerrainTileByCoordinates(coordinates);

      if (terrainTile) {
        const image = gameState.getAssetImage(terrainTile.type)?.source;

        if (image) {
          ctx.drawImage(
            image,
            tileWidth * (terrainTile.backgroundPosition.x || 0) + (terrainTile.backgroundPosition.x || 0) * 3 + 1,
            tileHeight * (terrainTile.backgroundPosition.y || 0) + (terrainTile.backgroundPosition.y || 0) * 3 + 1,
            terrainTile.size.screen.width,
            terrainTile.size.screen.height,
            terrainTile.position.screen.x,
            terrainTile.position.screen.y,
            terrainTile.size.screen.width,
            terrainTile.size.screen.height,
          );
        }

        if (terrainTile.isMapExit) {
          const position = terrainTile.position.grid;

          const tl = gridToScreenSpace(position, gameState.mapSize);
          const tr = gridToScreenSpace({ x: position.x + 1, y: position.y }, gameState.mapSize);
          const br = gridToScreenSpace({ x: position.x + 1, y: position.y + 1 }, gameState.mapSize);
          const bl = gridToScreenSpace({ x: position.x, y: position.y + 1 }, gameState.mapSize);

          ctx.fillStyle = "rgba(0,255,0, .2)";
          ctx.beginPath();
          ctx.moveTo(tl.x + tileWidth / 2, tl.y);
          ctx.lineTo(tr.x + tileWidth / 2, tr.y);
          ctx.lineTo(br.x + tileWidth / 2, br.y);
          ctx.lineTo(bl.x + tileWidth / 2, bl.y);
          ctx.closePath();

          ctx.fill();
        }
      }
    });
  };

  return { renderTerrainTiles };
}
