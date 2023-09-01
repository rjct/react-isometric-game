import { constants } from "@src/constants";
import { degToRad } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const MiniMap = React.memo(function MiniMap() {
  const { gameState, uiState } = useGameState();

  const miniMapContainerRef = React.createRef<HTMLDivElement>();
  const miniMapCanvasRef = React.createRef<HTMLCanvasElement>();

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const miniMapZoom = constants.miniMap.ZOOM;
  const miniMapWidth = constants.miniMap.size.width;
  const miniMapHeight = constants.miniMap.size.height;

  const canvasWidth = miniMapWidth * wireframeTileWidth * miniMapZoom;
  const canvasHeight = miniMapHeight * wireframeTileHeight * miniMapZoom;

  const canvasMargin = (Math.sin(degToRad(45)) - 1 / 2) * canvasWidth;

  const { hero } = useHero();

  const getCoordinates = (coordinates: GridCoordinates) => {
    return {
      x: coordinates.x * wireframeTileWidth * miniMapZoom,
      y: coordinates.y * wireframeTileHeight * miniMapZoom,
    };
  };

  const renderMiniMap = () => {
    if (!miniMapCanvasRef.current) return;

    const ctx = miniMapCanvasRef.current.getContext("2d");

    if (!ctx) return;

    const buildingColors: { [key: string]: string } = {
      wall: "mediumseagreen",
      vehicle: "green",
      furniture: "green",
    };

    // clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // hero pin
    const shiftX = miniMapWidth / 2 - hero.position.x;
    const shiftY = miniMapHeight / 2 - hero.position.y;

    ctx.fillStyle = "#ffffff";
    ctx.arc(
      canvasWidth / 2 + (wireframeTileWidth / 2) * miniMapZoom,
      canvasHeight / 2 + (wireframeTileWidth / 2) * miniMapZoom,
      (wireframeTileWidth / 2) * miniMapZoom,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    gameState
      .getAliveEnemiesArray()
      .filter((enemy) => gameState.isEntityVisible(enemy))
      .forEach((enemy) => {
        const enemyCoordinates = getCoordinates({ x: enemy.position.x + shiftX, y: enemy.position.y + shiftY });

        ctx.fillStyle = "red";
        ctx.fillRect(
          enemyCoordinates.x,
          enemyCoordinates.y,
          wireframeTileWidth * miniMapZoom,
          wireframeTileHeight * miniMapZoom,
        );
      });

    gameState.buildings
      .filter((building) => gameState.isEntityVisible(building))
      .forEach((building) => {
        const buildingClass = building.class as string;
        const buildingCoordinates = getCoordinates({
          x: building.position.x + shiftX,
          y: building.position.y + shiftY,
        });

        ctx.fillStyle = buildingColors[buildingClass];

        ctx.fillRect(
          buildingCoordinates.x,
          buildingCoordinates.y,
          building.size.grid.width * wireframeTileWidth * miniMapZoom,
          building.size.grid.length * wireframeTileHeight * miniMapZoom,
        );
      });
  };

  React.useEffect(() => {
    renderMiniMap();
  }, [gameState.getAllAliveUnitsHash(), gameState.settings.featureEnabled.fogOfWar]);

  return uiState.scene === "game" ? (
    <div ref={miniMapContainerRef} className={`mini-map`}>
      <canvas
        ref={miniMapCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          marginLeft: canvasMargin,
          marginRight: canvasMargin,
          marginTop: -canvasMargin / 2,
          marginBottom: -canvasMargin / 2,
        }}
      ></canvas>
    </div>
  ) : null;
});
