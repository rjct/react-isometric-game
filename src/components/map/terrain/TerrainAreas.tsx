import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";

export const TerrainAreas = React.memo(function TerrainAreas() {
  const { gameState, uiState } = useGameState();

  const canvasRef = React.createRef<HTMLCanvasElement>();
  const [ctx, setCtx] = React.useState(null as unknown as CanvasRenderingContext2D);

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const clear = () => {
    ctx.clearRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);
  };

  const renderTerrainTiles = () => {
    gameState.terrain.forEach((terrainArea) => {
      for (let x = terrainArea.target.x1; x < terrainArea.target.x2; x++) {
        for (let y = terrainArea.target.y1; y < terrainArea.target.y2; y++) {
          const position = { x, y };
          const screenPosition = gameState.gridToScreenSpace(position);
          const terrainTile = terrainArea.tiles.get(`${x}:${y}`);

          if (terrainTile) {
            const image = gameState.mediaFiles[terrainTile.type]?.img;

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
                tileHeight
              );
            }
          }
        }
      }

      if (terrainArea.exitUrl) {
        const { x1, y1, x2, y2 } = terrainArea.target;

        const width = x2 - x1;
        const height = y2 - y1;

        const tl = gameState.gridToScreenSpace({ x: x1, y: y1 });
        const tr = gameState.gridToScreenSpace({ x: x1 + width, y: y1 });
        const br = gameState.gridToScreenSpace({ x: x2, y: y2 });
        const bl = gameState.gridToScreenSpace({ x: x1, y: y1 + height });

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

  React.useEffect(() => {
    if (!ctx) return;

    clear();
    renderTerrainTiles();
  }, [
    gameState.mapSize,
    gameState.mapUrl,
    gameState.getTerrainHash(),
    //
    uiState.scene,
  ]);

  React.useEffect(() => {
    setCtx(canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
  }, []);

  return (
    <div
      className={"terrain"}
      style={{
        width: mapWidth * tileWidth + (uiState.scene === "editor" ? constants.editor.propsEditor.width : 0),
        height: mapHeight * tileHeight,
      }}
    >
      <canvas
        ref={canvasRef}
        width={`${mapWidth * tileWidth + (uiState.scene === "editor" ? constants.editor.propsEditor.width : 0)}`}
        height={`${mapHeight * tileHeight}`}
      ></canvas>
    </div>
  );
});
