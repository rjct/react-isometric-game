import React from "react";
import { Buildings } from "./buildings/Buildings";
import { Units } from "./units/Units";
import { GameUI } from "../../context/GameUIContext";
import { constants } from "../../constants";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { FogOfWar } from "./terrain/FogOfWar";
import { DebugVisualization } from "../debug/DebugVisualization";
import { Building } from "../../engine/BuildingFactory";
import { WireframeTiles } from "./terrain/WireframeTiles";
import { TerrainAreas } from "./terrain/TerrainAreas";
import { TerrainEditor } from "../editor/terrain/TerrainEditor";
import { LightsAndShadows } from "./terrain/LightsAndShadows";
import { BuildingEditor } from "../editor/building/BuildingEditor";
import { LightEditor } from "../editor/light/LightEditor";

export type MapForwardedRefs = {
  setScroll: (position: ScreenCoordinates) => null;
};

export const Map = React.forwardRef((props, forwardedRefs) => {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  const mapRef = React.useRef<HTMLDivElement>(null);

  const { hero } = useHero();

  const handleMouseDown = () => {
    gameDispatch({ type: "clearSelectedBuilding" });
    gameDispatch({ type: "clearSelectedTerrainArea" });
    gameDispatch({ type: "clearSelectedLight" });
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

    if (
      grid.x < 0 ||
      grid.x > gameState.mapSize.width ||
      grid.y < 0 ||
      grid.y > gameState.mapSize.height ||
      e.dataTransfer.getData("add/entity") === ""
    )
      return;

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
    forwardedRefs,
    () => {
      return {
        setScroll: (position: ScreenCoordinates) => {
          if (mapRef.current) {
            mapRef.current.scrollLeft = position.x;
            mapRef.current.scrollTop = position.y;
          }
        },
      };
    },
    []
  );

  return (
    <>
      <div
        ref={mapRef}
        className="map-wrapper"
        onMouseDown={handleMouseDown}
        onScroll={handleScroll}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-scrolling-active={uiState.isScrolling() || null}
        data-scrolling-direction={uiState.scrollDirection}
        data-editing-active={uiState.scene === "editor" || null}
        data-editor-mode={uiState.scene === "editor" ? uiState.editorMode : null}
      >
        <FogOfWar />
        <LightsAndShadows />
        <DebugVisualization />
        <WireframeTiles />

        <BuildingEditor />
        <TerrainEditor />
        <LightEditor />
        <TerrainAreas />

        <Buildings />
        <Units />
      </div>
    </>
  );
});
