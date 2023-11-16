import { MapLayer } from "@src/components/map/MapLayer";
import { WireframeEntityPlaceholder } from "@src/components/map/terrain/WireframeEntityPlaceholder";
import { WireframeMarker } from "@src/components/map/terrain/WireframeMarker";
import { constants } from "@src/engine/constants";
import { Unit } from "@src/engine/unit/UnitFactory";

import { HeroActionsMenu } from "@src/components/map/terrain/HeroActionsMenu";
import { WireframeTooltip } from "@src/components/map/terrain/WireframeTooltip";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { HeroAction, useHero } from "@src/hooks/useHero";
import React from "react";
import { isMobile } from "react-device-detect";
import { useDebounce } from "use-debounce";

export const Wireframe = React.memo(function WireframeTiles() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { hero, doHeroAction, getPossibleHeroActions } = useHero();
  const { getEditorLibraryPosition } = useEditor();

  const [markerPosition, setMarkerPosition] = React.useState<GridCoordinates>({ x: 0, y: 0 });
  const debouncedMarkerPosition = useDebounce(markerPosition, 200);

  const [tooltipValue, setTooltipValue] = React.useState<React.ReactElement | null>(null);

  const [markerClassName, setMarkerClassName] = React.useState(["action--allowed"]);
  const [clicks, setClicks] = React.useState(0);
  const [heroAction, setHeroAction] = React.useState<HeroAction[]>([]);
  const [heroActionMenuShow, setHeroActionMenuShow] = React.useState(false);

  const wireframeCellsBackground = React.useMemo(() => {
    return `repeating-linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px)`;
  }, [gameState.debug.enabled && gameState.debug.featureEnabled.wireframe]);

  const handleClick = () => {
    const isAllowed = heroAction.some((action) => action.isAllowed);

    setMarkerClassName([
      ...markerClassName,
      ...[isAllowed ? "perform-action--allowed" : "perform-action--not-allowed"],
    ]);

    if (isAllowed) {
      doHeroAction("click", heroAction[0]);
    }
  };

  const handleDoubleClick = () => {
    const isAllowed = heroAction.some((action) => action.isAllowed);

    setMarkerClassName([
      ...markerClassName,
      ...[isAllowed ? "perform-action--allowed" : "perform-action--not-allowed"],
    ]);

    if (isAllowed) {
      doHeroAction("doubleClick", heroAction[0]);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setHeroActionMenuShow(false);

    const userActions: Array<Unit["currentSelectedAction"]> = ["move", "explore", "leftHand", "rightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  const handleMouseDown = () => {
    const isAllowed = heroAction.some((action) => action.isAllowed);

    if (isAllowed) {
      doHeroAction("mouseDown", heroAction[0]);
    }
  };

  const handleMouseUp = () => {
    doHeroAction("mouseUp", heroAction[0]);
  };

  const updateMarker = (heroAction: Array<HeroAction>) => {
    if (heroAction.length === 0) {
      setMarkerClassName(["action--not-allowed"]);
      return;
    }

    if (heroAction.length === 1) {
      const action = heroAction[0].action;
      const isAllowed = heroAction[0].isAllowed;
      const entity = heroAction[0].entity;

      setMarkerClassName([isAllowed ? "action--allowed" : "action--not-allowed"]);

      switch (action) {
        case "explore":
          if (isAllowed) {
            gameDispatch({ type: "highlightExplorableEntity", entity });
          }
          break;

        case "leftHand":
        case "rightHand":
          const probability = heroAction[0]?.probability;
          const value = probability ? <>{`${isAllowed ? probability : 0}%`}</> : null;

          setTooltipValue(value);
          break;
      }
    } else {
      setHeroActionMenuShow(true);
      gameDispatch({ type: "highlightExplorableEntity", entity: heroAction[0].entity });
    }
  };

  const handleHeroActionsMenuMouseLeave = () => {
    setHeroActionMenuShow(false);
  };

  const handleHeroActionsMenuClick = (heroAction: HeroAction) => {
    setHeroActionMenuShow(false);

    doHeroAction("click", heroAction);
  };

  React.useEffect(() => {
    if (uiState.mousePosition.isOutOfGrid || heroActionMenuShow) {
      setMarkerPosition({ x: -1, y: -1 });

      return;
    }

    setTooltipValue(null);
    setMarkerClassName(["action--pending"]);
    setMarkerPosition(uiState.mousePosition.grid);
  }, [uiState.mousePosition.grid.x, uiState.mousePosition.grid.y, heroActionMenuShow]);

  React.useEffect(() => {
    if (heroActionMenuShow) return;

    if (gameState.highlightedEntityForInventoryTransfer) {
      gameDispatch({ type: "highlightExplorableEntity", entity: null });
    }

    setHeroAction(getPossibleHeroActions(uiState.mousePosition.grid));
  }, [debouncedMarkerPosition[0], hero.currentSelectedAction, heroActionMenuShow]);

  React.useEffect(() => {
    updateMarker(heroAction);
  }, [heroAction]);

  React.useEffect(() => {
    let singleClickTimer: number;

    if (clicks === 1) {
      singleClickTimer = window.setTimeout(
        function () {
          handleClick();
          setClicks(0);
        },
        isMobile ? 150 : 250,
      );
    } else if (clicks === 2) {
      handleDoubleClick();
      setClicks(0);
    }

    return () => window.clearTimeout(singleClickTimer);
  }, [clicks]);

  return (
    <>
      <WireframeTooltip
        key={markerClassName.join("")}
        coordinates={markerPosition}
        className={markerClassName}
        value={tooltipValue}
      />

      <div
        className={"wireframe-wrapper"}
        data-entity-selected-for-inventory-transfer={!!gameState.selectedEntityForInventoryTransfer || null}
        data-action={heroAction[0]?.action}
        data-action-allowed={heroAction[0]?.isAllowed ? undefined : false}
        style={{
          width: gameState.mapSize.width * constants.tileSize.width + getEditorLibraryPosition(),
          height: gameState.mapSize.height * constants.tileSize.height,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={() => (heroActionMenuShow ? null : setClicks(clicks + 1))}
        onContextMenu={handleRightClick}
      >
        <MapLayer
          isometric={true}
          size={gameState.mapSize}
          className={"wireframe"}
          style={{
            background:
              gameState.debug.enabled && gameState.debug.featureEnabled.wireframe
                ? wireframeCellsBackground
                : undefined,
          }}
        >
          <WireframeMarker
            coordinates={markerPosition}
            className={markerClassName}
            value={""}
            onAnimationComplete={() => {
              const classes = [...markerClassName];
              classes.pop();

              setMarkerClassName(classes);
            }}
          />

          <HeroActionsMenu
            show={heroActionMenuShow}
            coordinates={heroAction[0]?.position || markerPosition}
            heroActions={heroAction}
            onMouseLeave={handleHeroActionsMenuMouseLeave}
            onClick={handleHeroActionsMenuClick}
          />

          <WireframeEntityPlaceholder />
        </MapLayer>
      </div>
    </>
  );
});
