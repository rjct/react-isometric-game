import React from "react";
import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";

export const TerrainTiles = React.memo(function TerrainTiles() {
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
    for (let y = 0; y < gameState.matrix.length; y++) {
      for (let x = 0; x < gameState.matrix[y].length; x++) {
        const tile = gameState.tiles[y][x];

        if (tile.sprite) {
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
        }
      }
    }
  };

  const renderExitPoints = () => {
    gameState.getExitPoints().forEach((exitPoint) => {
      ctx.beginPath();
      for (let x = exitPoint.area.x1; x <= exitPoint.area.x2; x++) {
        for (let y = exitPoint.area.y1; y <= exitPoint.area.y2; y++) {
          const screen = gameState.gridToScreenSpace({ x, y });

          ctx.moveTo(screen.x + tileWidth / 2, screen.y);
          ctx.lineTo(screen.x, screen.y + tileHeight / 2);
          ctx.lineTo(screen.x + tileWidth / 2, screen.y + tileHeight);
          ctx.lineTo(screen.x + tileWidth, screen.y + tileHeight / 2);
          ctx.closePath();
        }
      }
      ctx.fillStyle = "rgba(0,255,0, 0.2)";
      ctx.fill();
    });
  };

  React.useEffect(() => {
    if (!ctx) return;

    clear();
    renderTerrainTiles();
    renderExitPoints();
  }, [
    gameState.mapSize,
    gameState.mapUrl,
    gameState.terrain,
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
