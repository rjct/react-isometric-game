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
      doHeroAction(uiState.mousePosition);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const userActions: Array<Unit["currentSelectedAction"]> = ["walk", "run", "leftHand", "rightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  const updateMarkerColor = () => {
    let className = "action--allowed";

    if (
      gameState.mapSize.width === 0 ||
      (uiState.scene === "combat" && gameState.combatQueue.currentUnitId !== hero.id)
    ) {
      setMarkerClassName(["action--not-allowed"]);
      setMarkerValue("");

      return;
    }

    switch (true) {
      case hero.isUsingHands():
        // eslint-disable-next-line no-case-declarations
        const weapon = hero.getCurrentWeapon();

        if (weapon) {
          weapon.aimAt(uiState.mousePosition.grid);

          if (
            !weapon.isReadyToUse() ||
            (uiState.scene === "combat" && weapon.actionPointsConsumption > hero.actionPoints.current)
          ) {
            className = "action--not-allowed";
            weapon.stopAiming();
          }
        }

        setMarkerValue("");
        break;

      default:
        const unitPath = gameState.calcUnitPath(hero, uiState.mousePosition.grid);

        if (
          unitPath.length === 0 ||
          (uiState.scene === "combat" &&
            hero.actionPoints.current / hero.getCurrentActionPointsConsumption() < unitPath.length - 1)
        ) {
          className = "action--not-allowed";
        }

        setMarkerValue(uiState.scene === "combat" ? String(unitPath.length - 1) : "");
    }

    setMarkerClassName([className]);
  };

  React.useEffect(() => {
    if (uiState.mousePosition.isOutOfGrid) return;

    setMarkerClassName(["action--pending"]);
    setMarkerPosition(uiState.mousePosition.grid);
  }, [uiState.mousePosition.grid.x, uiState.mousePosition.grid.y]);

  React.useEffect(() => {
    if (uiState.mousePosition.isOutOfGrid) return;

    updateMarkerColor();
  }, [debouncedMarkerPosition[0]]);

  return (
    <div
      className={"wireframe-wrapper"}
      style={{
        width: gameState.mapSize.width * constants.tileSize.width + getEditorLibraryPosition(),
        height: gameState.mapSize.height * constants.tileSize.height,
      }}
      onClick={handleClick}
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
