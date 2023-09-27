import { GameMap } from "@src/engine/gameMap";

export const useLightsAndShadows = (gameState: GameMap) => {
  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const tileWidth = 1; //constants.wireframeTileSize.width;
  const tileHeight = 1; //constants.wireframeTileSize.height;
  const renderShadows = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);

    if (!gameState.settings.featureEnabled.shadow) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";

    ctx.globalAlpha = gameState.globalShadows.opacity;
    ctx.fillStyle = gameState.globalShadows.color;
    ctx.fillRect(0, 0, mapWidth * tileWidth, mapHeight * tileHeight);

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
        ctx.moveTo(light.intersectsWithWalls[0].x * tileWidth, light.intersectsWithWalls[0].y * tileHeight);

        for (let i = 1; i < light.intersectsWithWalls.length; i++) {
          const intersect = light.intersectsWithWalls[i];
          ctx.lineTo(intersect.x * tileWidth, intersect.y * tileHeight);
        }

        ctx.fill();
      });
  };

  const renderLights = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, mapWidth, mapHeight);

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
          light.position.x,
          light.position.y,
          light.radius / 2,
          light.position.x,
          light.position.y,
          light.radius,
        );
        colorGradient.addColorStop(0, `${color}FF`);
        colorGradient.addColorStop(0.5, `${color}80`);
        colorGradient.addColorStop(1, `${color}00`);

        ctx.globalCompositeOperation = "screen";

        ctx.fillStyle = colorGradient;
        ctx.beginPath();
        ctx.moveTo(light.intersectsWithWalls[0].x, light.intersectsWithWalls[0].y);

        for (let i = 1; i < light.intersectsWithWalls.length; i++) {
          const intersect = light.intersectsWithWalls[i];
          ctx.lineTo(intersect.x, intersect.y);
        }
        ctx.fill();
      });
  };

  return { renderShadows, renderLights };
};
