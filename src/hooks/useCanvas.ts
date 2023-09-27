import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";

export function useCanvas() {
  const { gameState } = useGameState();

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, mapWidth * wireframeTileWidth, mapHeight * wireframeTileHeight);
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    position: GridCoordinates,
    color = "#ffffff",
    fillStyle?: CanvasGradient | string,
    lineWidth = 1,
    radius = wireframeTileWidth / 2,
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (fillStyle) ctx.fillStyle = fillStyle;
    ctx.arc(
      position.x * wireframeTileWidth + wireframeTileWidth / 2 + 0.5,
      position.y * wireframeTileHeight + wireframeTileHeight / 2 + 0.5,
      radius,
      0,
      2 * Math.PI,
    );
    if (lineWidth > 0) ctx.stroke();
    if (fillStyle) ctx.fill();
  };

  const drawFillRect = (
    ctx: CanvasRenderingContext2D,
    position: GridCoordinates,
    color = "#ffffff",
    lineWidth = 1,
    size = { width: 1, length: 1, height: 1 } as Size3D,
  ) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.fillRect(
      position.x * wireframeTileWidth,
      position.y * wireframeTileHeight,
      size.width * wireframeTileWidth,
      size.length * wireframeTileHeight,
    );
    ctx.stroke();
  };

  const drawRect = (
    ctx: CanvasRenderingContext2D,
    position: GridCoordinates,
    color = "#ffffff",
    lineWidth = 1,
    size = { width: wireframeTileWidth, height: wireframeTileHeight } as Size2D,
  ) => {
    ctx.beginPath();
    ctx.rect(position.x * wireframeTileWidth, position.y * wireframeTileHeight, size.width, size.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    from: GridCoordinates,
    to: GridCoordinates,
    color = "rgba(255,255,255, 0.5)",
  ) => {
    ctx.beginPath();
    ctx.moveTo(from.x * wireframeTileWidth + 0.5, from.y * wireframeTileWidth + 0.5);
    ctx.lineTo(to.x * wireframeTileHeight + 0.5, to.y * wireframeTileHeight + 0.5);
    ctx.fillStyle = color;
    ctx.fill();
  };

  return {
    clearCanvas,
    drawCircle,
    drawFillRect,
    drawRect,
    drawLine,
  };
}
