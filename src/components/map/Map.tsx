import React from "react";
import { Terrain } from "./terrain/Terrain";
import { Buildings } from "./buildings/Buildings";
import { Units } from "./units/Units";
import { GameUI } from "../../context/GameUIContext";
import { constants } from "../../constants";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { FogOfWar } from "./terrain/FogOfWar";
import { PathVisualization } from "./terrain/PathVisualization";
import { Building } from "../../engine/BuildingFactory";
import { TerrainEditor } from "../editor/terrain/TerrainEditor";

export const Map = React.forwardRef((props, setScrollRef) => {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  const mapRef = React.useRef<HTMLDivElement>(null);

  const { hero, doHeroAction } = useHero();

  const handleClick = () => {
    doHeroAction();
  };

  const handleMouseDown = () => {
    gameDispatch({ type: "clearSelectedBuilding" });
    gameDispatch({ type: "clearSelectedTerrainArea" });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { rect, scroll } = uiState;

    const browser = {
      x: Math.round(e.clientX + scroll.x) - scroll.x,
      y: Math.round(e.clientY - rect.top) - scroll.y,
    };

    const screen = {
      x: Math.round(e.clientX - constants.tileSize.width + constants.tileSize.width / 2 + scroll.x),
      y: Math.round(e.clientY - rect.top) + scroll.y,
    };
    const grid = gameState.screenSpaceToGridSpace(screen);

    const mousePosition = {
      grid: {
        x: Math.floor(grid.x),
        y: Math.floor(grid.y),
      },
      screen: screen,
      browser: browser,
      isOutOfGrid:
        Math.floor(grid.x) < 0 ||
        Math.floor(grid.x) > gameState.mapSize.width - 1 ||
        Math.floor(grid.y) < 0 ||
        Math.floor(grid.y) > gameState.mapSize.height - 1,
    };

    uiDispatch({ type: "setMousePosition", mousePosition });

    if (!hero.isMoving() && uiState.scene === "game") {
      hero.setDirection(
        Math.atan2(mousePosition.grid.y - hero.position.y, mousePosition.grid.x - hero.position.x) * (180 / Math.PI)
      );
    }
  };

  const handleMouseOut = () => {
    uiDispatch({ type: "resetMousePosition" });
  };

  const handleScroll = () => {
    if (mapRef.current) {
      uiDispatch({ type: "scrollMap", scroll: getCurrentScroll() });
      uiDispatch({ type: "setViewport", viewport: getCurrentViewport() });
    }
  };

  const handleDragOver = function (e: React.DragEvent) {
    if (uiState.scene !== "editor") return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    if (uiState.scene !== "editor") return;

    e.preventDefault();

    const screen = {
      x: Math.round(e.clientX - constants.tileSize.width + constants.tileSize.width / 2 + uiState.scroll.x),
      y: Math.round(e.clientY - uiState.rect.top) + uiState.scroll.y,
    };
    const grid = gameState.screenSpaceToGridSpace(screen);

    if (grid.x < 0 || grid.x > gameState.mapSize.width || grid.y < 0 || grid.y > gameState.mapSize.height) return;

    const entity = JSON.parse(e.dataTransfer.getData("add/entity"));
    const direction = e.dataTransfer.getData("add/entity/direction") as Building["direction"];
    const variant = Number(e.dataTransfer.getData("add/entity/variant")) as Building["variant"];

    gameDispatch({
      type: "addBuilding",
      entity,
      position: { x: Math.floor(grid.x), y: Math.floor(grid.y) },
      direction,
      variant,
    });
  };

  //
  const getCurrentScroll = (): GameUI["scroll"] => {
    return {
      x: mapRef.current?.scrollLeft,
      y: mapRef.current?.scrollTop,
    } as GameUI["scroll"];
  };

  const getCurrentRect = (): GameUI["rect"] => {
    return mapRef.current?.getBoundingClientRect() as GameUI["rect"];
  };

  const getCurrentViewport = (): GameUI["viewport"] => {
    const rect = getCurrentRect();
    const scroll = getCurrentScroll();

    return {
      x1: rect.x + scroll.x,
      x2: rect.width + scroll.x,
      y1: rect.y + scroll.y - rect.top,
      y2: rect.height + scroll.y,
    };
  };

  React.useEffect(() => {
    if (gameState.mapSize.width === 0 || gameState.mapSize.height === 0) return;

    if (mapRef.current) {
      uiDispatch({ type: "scrollMap", scroll: getCurrentScroll() });
      uiDispatch({ type: "setMapRect", rect: getCurrentRect() });
      uiDispatch({ type: "setViewport", viewport: getCurrentViewport() });
      uiDispatch({ type: "resetMousePosition" });
      uiDispatch({ type: "centerMapOnHero", unitCoordinates: gameState.gridToScreenSpace(hero.position) });
    }
  }, [gameState.mapSize]);

  React.useImperativeHandle(
    setScrollRef,
    () => {
      return (position: Coordinates) => {
        if (mapRef.current) {
          mapRef.current.scrollLeft = position.x;
          mapRef.current.scrollTop = position.y;
        }
      };
    },
    []
  );

  return (
    <>
      <div
        ref={mapRef}
        className="map-wrapper"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onScroll={handleScroll}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-scrolling-active={uiState.isScrolling() || null}
        data-scrolling-direction={uiState.scrollDirection}
        data-editing-active={uiState.scene === "editor" || null}
        data-editor-mode={uiState.scene === "editor" ? uiState.editorMode : null}
      >
        <FogOfWar />
        <PathVisualization />
        <TerrainEditor />
        <Terrain />
        <Buildings />
        <Units />
      </div>
    </>
  );
});
