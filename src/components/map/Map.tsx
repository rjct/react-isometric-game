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

export const Map = React.forwardRef((props, setScrollRef) => {
  const { gameState, uiState, uiDispatch } = useGameState();

  const mapRef = React.useRef<HTMLDivElement>(null);

  const { hero, doHeroAction } = useHero();

  const handleClick = () => {
    doHeroAction();
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

    if (!hero.isMoving()) {
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
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onScroll={handleScroll}
        data-scrolling-active={uiState.isScrolling()}
        data-scrolling-direction={uiState.scrollDirection}
      >
        <FogOfWar />
        <PathVisualization />
        <Terrain />
        <Buildings />
        <Units />
      </div>
    </>
  );
});
