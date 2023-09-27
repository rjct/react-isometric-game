import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export function useFogOfWar(gameState: GameMap) {
  const renderFogOfWar = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
    const hideFill = `rgba( 0, 0, 0, ${constants.FOG_OF_WAR_OPACITY})`;
    const radius = 1;

    ctx.clearRect(0, 0, gameState.mapSize.width, gameState.mapSize.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = hideFill;
    ctx.fillRect(0, 0, gameState.mapSize.width, gameState.mapSize.height);

    ctx.globalCompositeOperation = "destination-out";

    for (let y = 0; y < gameState.fogOfWarMatrix.length; y++) {
      for (let x = 0; x < gameState.fogOfWarMatrix[y].length; x++) {
        if (gameState.isCellVisited(x, y)) {
          const x2 = x + 0.5;
          const y2 = y + 0.5;

          ctx.fillStyle = "#000000";

          ctx.fillRect(x2 - radius, y2 - radius, radius * 2, radius * 2);
        }
      }
    }
  };

  return { renderFogOfWar };
}
