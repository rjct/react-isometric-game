import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";
import { useMousePosition, WorldMousePosition } from "../../../hooks/useMousePosition";
import { Unit } from "../../../engine/UnitFactory";
import { constants } from "../../../constants";
import { WireframeMarker } from "./WireframeMarker";
import { MapLayer } from "../MapLayer";

export const Wireframe = React.memo(function WireframeTiles() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { hero, doHeroAction } = useHero();
  const { getWorldMousePosition } = useMousePosition();

  const [mousePosition, setMousePosition] = React.useState(null as unknown as WorldMousePosition);
  const [markerPosition, setMarkerPosition] = React.useState({ x: 0, y: 0 } as GridCoordinates);
  const [markerClassName, setMarkerClassName] = React.useState(["action--allowed"]);
  const [markerValue, setMarkerValue] = React.useState("");
  const wireframeCellsBackground = React.useMemo(() => {
    return `repeating-linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 1px, transparent 1px, transparent ${constants.wireframeTileSize.width}px)`;
  }, [gameState.debug.enabled && gameState.debug.featureEnabled.wireframe]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition(getWorldMousePosition(e));
  };

  const handleClick = () => {
    setMarkerClassName([
      ...markerClassName,
      ...[markerClassName.includes("action--allowed") ? "perform-action--allowed" : "perform-action--not-allowed"],
    ]);

    if (markerClassName.includes("action--allowed")) {
      doHeroAction(mousePosition);
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

    if (uiState.scene === "combat" && gameState.combatQueue.currentUnitId !== hero.id) {
      setMarkerClassName(["action--not-allowed"]);
      setMarkerValue("");

      return;
    }

    switch (true) {
      case hero.isUsingHands():
        // eslint-disable-next-line no-case-declarations
        const weapon = hero.getCurrentWeapon();

        if (weapon) {
          weapon.aimAt(mousePosition.grid);

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
        const unitPath = gameState.calcUnitPath(hero, mousePosition.grid);

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
    setMousePosition(null as unknown as WorldMousePosition);
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    if (!mousePosition || mousePosition.isOutOfGrid) return;

    setMarkerPosition(mousePosition.grid);
    updateMarkerColor();
  }, [mousePosition?.grid.x, mousePosition?.grid.y]);

  return (
    <MapLayer
      size={gameState.mapSize}
      className={"wireframe"}
      style={{
        background:
          gameState.debug.enabled && gameState.debug.featureEnabled.wireframe ? wireframeCellsBackground : "none",
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {uiState.scene === "game" || uiState.scene === "combat" ? (
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
      ) : null}
    </MapLayer>
  );
});
