import { constants } from "../constants";
import { GameMap } from "../engine/GameMap";

export const useLightsAndShadows = (gameState: GameMap) => {
  const renderLightsAndShadows = (ctx: CanvasRenderingContext2D) => {
    if (gameState.settings.featureEnabled.light || gameState.settings.featureEnabled.shadow) {
      ctx.globalCompositeOperation = "source-over";

      if (gameState.settings.featureEnabled.shadow) {
        ctx.globalAlpha = gameState.shadows.opacity;
        ctx.fillStyle = gameState.shadows.color;
        ctx.fillRect(
          0,
          0,
          gameState.mapSize.width * constants.wireframeTileSize.width,
          gameState.mapSize.height * constants.wireframeTileSize.height
        );
      }

      ctx.lineWidth = 0;

      if (gameState.settings.featureEnabled.light && gameState.settings.featureEnabled.shadow) {
        for (const light of gameState.lights) {
          for (const ray of light.rays) {
            ray.pathEnd(ctx);
          }
        }
      }

      if (gameState.settings.featureEnabled.shadow) {
        ctx.globalCompositeOperation = "destination-out";

        for (const light of gameState.lights) {
          for (const ray of light.rays) {
            ray.draw(ctx, false);
          }
        }
      }

      if (gameState.settings.featureEnabled.light) {
        ctx.globalCompositeOperation = "xor"; //"source-atop";

        for (const light of gameState.lights) {
          for (const ray of light.rays) {
            ray.draw(ctx);
          }
        }
      }
    }
  };

  return { renderLightsAndShadows };
};
