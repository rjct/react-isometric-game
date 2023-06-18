import React from "react";
import { constants } from "../../constants";
import { rotateRect } from "../../engine/helpers";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { BuildingClass } from "../../engine/BuildingFactory";

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

    // clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // fill background
    ctx.fillStyle = "rgba( 0, 0, 0, .7 )";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // hero pin
    const { x, y } = getCoordinates(hero.position);

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, wireframeTileWidth * miniMapZoom, wireframeTileHeight * miniMapZoom);

    // enemies pins
    ctx.fillStyle = "red";
    gameState
      .getAllAliveUnitsArray()
      .filter((unit) => unit.id !== gameState.heroId && gameState.isEntityVisible(unit))
      .forEach((unit) => {
        const { x, y } = getCoordinates(unit.position);

        ctx.fillRect(x, y, wireframeTileWidth * miniMapZoom, wireframeTileHeight * miniMapZoom);
      });

    // buildings
    const buildingColors: { [key: string]: string } = {
      wall: "mediumseagreen",
      vehicle: "green",
    };

    gameState.buildings
      .filter(
        (building) =>
          (["wall", "vehicle"] as BuildingClass[]).includes(building.class) &&
          (!gameState.settings.featureEnabled.fogOfWar || gameState.isEntityVisible(building))
      )
      .forEach((building) => {
        const { position, size } = building;

        const coordinates = getCoordinates(position);
        const dimensions = getCoordinates({
          x: size.grid.width,
          y: size.grid.height,
        });

        const buildingClass = building.class as string;
        ctx.fillStyle = buildingColors[buildingClass];

        ctx.fillRect(coordinates.x, coordinates.y, dimensions.x, dimensions.y);
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
  }, [gameState.getFogOfWarMatrixHash(), gameState.getAllAliveUnitsHash(), gameState.settings.featureEnabled.fogOfWar]);

  React.useEffect(() => {
    centerMap();
  }, [hero.getHash()]);

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
