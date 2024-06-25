import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";

export const useLightsAndShadows = (gameState: GameMap) => {
  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const LRRM = constants.LIGHT_RENDER_RESOLUTION_MULTIPLIER;

  const renderShadows = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, mapWidth * LRRM, mapHeight * LRRM);

    if (!gameState.settings.featureEnabled.shadow) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";

    ctx.globalAlpha = gameState.globalShadows.opacity;
    ctx.fillStyle = gameState.globalShadows.color;
    ctx.fillRect(0, 0, mapWidth * LRRM, mapHeight * LRRM);

    //
    ctx.globalAlpha = 1 - gameState.globalShadows.opacity;
    ctx.globalCompositeOperation = "destination-out";

    gameState.lights
      .filter((light) => {
        return light.intersectsWithWalls.length > 0;
      })
      .forEach((light) => {
        ctx.fillStyle = light.getColor();

        ctx.beginPath();

        ctx.moveTo(light.intersectsWithWalls[0].x * LRRM, light.intersectsWithWalls[0].y * LRRM);

        for (let i = 1; i < light.intersectsWithWalls.length; i++) {
          const intersect = light.intersectsWithWalls[i];

          ctx.lineTo(intersect.x * LRRM, intersect.y * LRRM);
        }

        ctx.fill();
      });
  };

  const renderLights = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, mapWidth * LRRM, mapHeight * LRRM);

    if (!gameState.settings.featureEnabled.light) {
      return;
    }

    ctx.globalAlpha = gameState.globalLights.opacity;

    gameState.lights
      .filter((light) => {
        return light.intersectsWithWalls.length > 0;
      })
      .forEach((light) => {
        const color = light.getColor();

        const colorGradient = ctx.createRadialGradient(
          light.position.grid.x * LRRM,
          light.position.grid.y * LRRM,
          light.radius * LRRM,
          light.position.grid.x * LRRM,
          light.position.grid.y * LRRM,
          light.radius,
        );
        colorGradient.addColorStop(1, `${color}FF`);
        colorGradient.addColorStop(0.5, `${color}80`);
        colorGradient.addColorStop(0, `${color}00`);

        ctx.globalCompositeOperation = "screen";

        ctx.fillStyle = colorGradient;
        ctx.beginPath();
        ctx.moveTo(light.intersectsWithWalls[0].x * LRRM, light.intersectsWithWalls[0].y * LRRM);

        for (let i = 1; i < light.intersectsWithWalls.length; i++) {
          const intersect = light.intersectsWithWalls[i];
          ctx.lineTo(intersect.x * LRRM, intersect.y * LRRM);
        }
        ctx.fill();
      });
  };

  return { renderShadows, renderLights };
};
