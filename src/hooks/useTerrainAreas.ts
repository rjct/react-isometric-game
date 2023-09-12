import { constants } from "@src/constants";
import { GameUI } from "@src/context/GameUIContext";
import { GameMap } from "@src/engine/GameMap";
import { gridToScreenSpace } from "@src/engine/helpers";
import { useEditor } from "@src/hooks/useEditor";
import { useScene } from "@src/hooks/useScene";

export function useTerrainAreas(gameState: GameMap, uiState: GameUI) {
  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const { checkCurrentScene } = useScene();
  const { checkEditorMode } = useEditor();
  const renderTerrainTiles = (ctx: CanvasRenderingContext2D) => {
    if (!ctx) return;

    const entityLibraryWidth =
      checkCurrentScene(["editor"]) && checkEditorMode(["buildings", "units"])
        ? constants.editor.entitiesLibrary.width + constants.editor.entitiesLibrary.left
        : 0;

    ctx.resetTransform();
    ctx.clearRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);
    ctx.setTransform(1, 0, 0, 1, -uiState.scroll.x + entityLibraryWidth, -uiState.scroll.y);

    gameState.terrain.forEach((terrainArea) => {
      for (let x = terrainArea.target.x1; x < terrainArea.target.x2; x++) {
        for (let y = terrainArea.target.y1; y < terrainArea.target.y2; y++) {
          const position = { x, y };

          if (
            !gameState.isEntityInViewport(
              {
                position: { x: x + entityLibraryWidth / constants.wireframeTileSize.width, y },
                size: {
                  grid: { width: 1, height: 1, length: 1 },
                  screen: {
                    width: constants.wireframeTileSize.width,
                    height: constants.wireframeTileSize.height,
                  },
                },
              },
              uiState.viewport,
            )
          ) {
            continue;
          }

          const screenPosition = gridToScreenSpace(position, gameState.mapSize);
          const terrainTile = terrainArea.tiles.get(`${x}:${y}`);

          if (terrainTile) {
            const image = gameState.getAssetImage(terrainTile.type)?.source;

            if (image) {
              ctx.drawImage(
                image,
                tileWidth * (terrainTile.x || 0) + (terrainTile.x || 0) * 3 + 1,
                tileHeight * (terrainTile.y || 0) + (terrainTile.y || 0) * 3 + 1,
                tileWidth,
                tileHeight,
                screenPosition.x,
                screenPosition.y,
                tileWidth,
                tileHeight,
              );
            }
          }
        }
      }

      if (terrainArea.exitUrl) {
        const { x1, y1, x2, y2 } = terrainArea.target;

        const width = x2 - x1;
        const height = y2 - y1;

        const tl = gridToScreenSpace({ x: x1, y: y1 }, gameState.mapSize);
        const tr = gridToScreenSpace({ x: x1 + width, y: y1 }, gameState.mapSize);
        const br = gridToScreenSpace({ x: x2, y: y2 }, gameState.mapSize);
        const bl = gridToScreenSpace({ x: x1, y: y1 + height }, gameState.mapSize);

        ctx.beginPath();
        ctx.moveTo(tl.x + tileWidth / 2, tl.y);
        ctx.lineTo(tr.x + tileWidth / 2, tr.y);
        ctx.lineTo(br.x + tileWidth / 2, br.y);
        ctx.lineTo(bl.x + tileWidth / 2, bl.y);

        ctx.fillStyle = "rgba(0,255,0, .2)";
        ctx.fill();
      }
    });
  };

  return { renderTerrainTiles };
}
