import React from "react";
import { constants } from "../../constants";
import { rotateRect } from "../../engine/helpers";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";

export const MiniMap = React.memo(function MiniMap() {
  const { gameState } = useGameState();

  const miniMapContainerRef = React.createRef<HTMLDivElement>();
  const miniMapCanvasRef = React.createRef<HTMLCanvasElement>();

  const tileWidth = constants.tileSize.width;
  const tileHeight = constants.tileSize.height;

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const miniMapZoom = constants.miniMap.ZOOM;
  const miniMapWidth = constants.miniMap.width;
  const miniMapHeight = constants.miniMap.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const canvasWidth = gameState.mapSize.width * wireframeTileWidth * miniMapZoom;
  const canvasHeight = gameState.mapSize.height * wireframeTileHeight * miniMapZoom;

  const rotatedMapCoordinates = rotateRect(45, miniMapWidth / 2, 0, miniMapWidth / 2, 0, canvasWidth, canvasHeight);

  const { hero } = useHero();

  const getCoordinates = (coordinates: Coordinates) => {
    return {
      x: coordinates.x * wireframeTileWidth * miniMapZoom,
      y: coordinates.y * wireframeTileHeight * miniMapZoom,
    };
  };

  const renderMiniMap = () => {
    if (!miniMapCanvasRef.current) return;

    const ctx = miniMapCanvasRef.current.getContext("2d");

    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // fill background
    ctx.fillStyle = "rgba( 0, 0, 0, .7 )";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // hero pin
    const { x, y } = getCoordinates(hero.position);

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillRect(x, y, wireframeTileWidth * miniMapZoom, wireframeTileHeight * miniMapZoom);
    ctx.stroke();

    // enemies pins
    ctx.fillStyle = "red";
    gameState
      .getAllAliveUnitsArray()
      .filter((unit) => unit.id !== gameState.heroId && gameState.isEntityVisible(unit))
      .forEach((unit) => {
        const { x, y } = getCoordinates(unit.position);

        ctx.beginPath();
        ctx.fillRect(x, y, wireframeTileWidth * miniMapZoom, wireframeTileHeight * miniMapZoom);
        ctx.stroke();
      });

    // buildings
    gameState.buildings.forEach((building) => {
      const { position, size } = building;

      const coordinates = getCoordinates(position);
      const dimensions = getCoordinates({
        x: size.grid.width,
        y: size.grid.height,
      });

      ctx.fillStyle = gameState.isEntityVisible(building) ? "limegreen" : "rgba(50, 205, 50, 0.4)";
      ctx.beginPath();
      ctx.fillRect(coordinates.x, coordinates.y, dimensions.x, dimensions.y);

      ctx.fill();
    });
  };

  const centerMap = () => {
    if (miniMapContainerRef.current) {
      const unitCoordinates = gameState.gridToScreenSpace(hero.position);

      const left = Math.round(unitCoordinates.x * miniMapZoom - miniMapWidth / 2);
      const top = Math.round(unitCoordinates.y * miniMapZoom) - miniMapHeight / 2;

      miniMapContainerRef.current.scrollLeft = left;
      miniMapContainerRef.current.scrollTop = top;
    }
  };

  React.useEffect(() => {
    renderMiniMap();
    centerMap();
  }, [
    JSON.stringify(gameState.fogOfWarMatrix),
    JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.path)),
    JSON.stringify(gameState.getAllAliveUnitsArray().map((unit) => unit.id)),
  ]);

  return (
    <div
      ref={miniMapContainerRef}
      style={{
        width: miniMapWidth,
        height: miniMapHeight,
      }}
      className={`mini-map${mapWidth * tileWidth * miniMapZoom > miniMapWidth ? "" : " centered-map"} with-overlay`}
    >
      <div
        className={"mini-map-wrapper"}
        style={{
          width: mapWidth * tileWidth * miniMapZoom,
          height: mapHeight * tileHeight * miniMapZoom,
        }}
      >
        <canvas
          ref={miniMapCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            left: 200 - rotatedMapCoordinates.bl.x,
          }}
        ></canvas>
      </div>
    </div>
  );
});
