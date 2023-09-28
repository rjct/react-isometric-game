import { MapLayer } from "@src/components/map/MapLayer";
import { WireframeEntityPlaceholder } from "@src/components/map/terrain/WireframeEntityPlaceholder";
import { WireframeMarker } from "@src/components/map/terrain/WireframeMarker";
import { constants } from "@src/engine/constants";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";
import { useDebounce } from "use-debounce";

export const Wireframe = React.memo(function WireframeTiles() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { hero, doHeroAction } = useHero();
  const { getEditorLibraryPosition } = useEditor();

  const [markerPosition, setMarkerPosition] = React.useState<GridCoordinates>({ x: 0, y: 0 });
  const debouncedMarkerPosition = useDebounce(markerPosition, 200);
  const [markerClassName, setMarkerClassName] = React.useState(["action--allowed"]);
  const [markerValue, setMarkerValue] = React.useState("");
  const [clicks, setClicks] = React.useState(0);
  const wireframeCellsBackground = React.useMemo(() => {
    return `repeating-linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px)`;
  }, [gameState.debug.enabled && gameState.debug.featureEnabled.wireframe]);

  const handleClick = () => {
    setMarkerClassName([
      ...markerClassName,
      ...[markerClassName.includes("action--allowed") ? "perform-action--allowed" : "perform-action--not-allowed"],
    ]);

    if (markerClassName.includes("action--allowed")) {
      doHeroAction(uiState.mousePosition, "click");
    }
  };

  const handleDoubleClick = () => {
    doHeroAction(uiState.mousePosition, "doubleClick");
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const userActions: Array<Unit["currentSelectedAction"]> = ["move", "explore", "leftHand", "rightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  const updateMarkerColor = () => {
    if (
      gameState.mapSize.width === 0 ||
      (uiState.scene === "combat" && gameState.combatQueue.currentUnitId !== hero.id)
    ) {
      setMarkerClassName(["action--not-allowed"]);
      setMarkerValue("");

      return;
    }

    switch (hero.currentSelectedAction) {
      case "leftHand":
      case "rightHand":
        const weapon = hero.getCurrentWeapon();

        if (weapon) {
          weapon.aimAt(uiState.mousePosition.grid);

          if (
            !weapon.isReadyToUse() ||
            (uiState.scene === "combat" && weapon.actionPointsConsumption > hero.actionPoints.current)
          ) {
            setMarkerClassName(["action--not-allowed"]);
            weapon.stopAiming();
          } else {
            setMarkerClassName(["action--allowed"]);
          }
        }

        setMarkerValue("");
        break;

      case "explore":
        const entity = gameState.getEntityByCoordinates(uiState.mousePosition.grid);

        setMarkerClassName([entity && entity.id !== hero.id ? "action--allowed" : "action--not-allowed"]);

        break;

      case "move":
        const unitPath = gameState.calcUnitPath(hero, uiState.mousePosition.grid);

        setMarkerClassName([
          unitPath.length === 0 ||
          (uiState.scene === "combat" &&
            hero.actionPoints.current / hero.getCurrentActionPointsConsumption() < unitPath.length - 1)
            ? "action--not-allowed"
            : "action--allowed",
        ]);

        setMarkerValue(uiState.scene === "combat" ? String(unitPath.length - 1) : "");
    }
  };

  React.useEffect(() => {
    if (uiState.mousePosition.isOutOfGrid) return;

    setMarkerClassName(["action--pending"]);
    setMarkerPosition(uiState.mousePosition.grid);
  }, [uiState.mousePosition.grid.x, uiState.mousePosition.grid.y]);

  React.useEffect(() => {
    if (uiState.mousePosition.isOutOfGrid) return;

    updateMarkerColor();
  }, [debouncedMarkerPosition[0], hero.currentSelectedAction]);

  React.useEffect(() => {
    let singleClickTimer: number;

    if (clicks === 1) {
      singleClickTimer = window.setTimeout(function () {
        handleClick();
        setClicks(0);
      }, 250);
    } else if (clicks === 2) {
      handleDoubleClick();
      setClicks(0);
    }

    return () => window.clearTimeout(singleClickTimer);
  }, [clicks]);

  return (
    <div
      className={"wireframe-wrapper"}
      style={{
        width: gameState.mapSize.width * constants.tileSize.width + getEditorLibraryPosition(),
        height: gameState.mapSize.height * constants.tileSize.height,
      }}
      onClick={() => setClicks(clicks + 1)}
      onContextMenu={handleRightClick}
    >
      <MapLayer
        isometric={true}
        size={gameState.mapSize}
        className={"wireframe"}
        style={{
          background:
            gameState.debug.enabled && gameState.debug.featureEnabled.wireframe ? wireframeCellsBackground : undefined,
        }}
      >
        <WireframeMarker
          coordinates={markerPosition}
          className={markerClassName}
          value={markerValue}
          onAnimationComplete={() => {
            const classes = [...markerClassName];
            classes.pop();

            setMarkerClassName(classes);
          }}
        />

        <WireframeEntityPlaceholder />
      </MapLayer>
    </div>
  );
});
