import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";
import { useMousePosition, WorldMousePosition } from "../../../hooks/useMousePosition";
import { Unit } from "../../../engine/UnitFactory";
import { constants } from "../../../constants";
import { WireframeMarker } from "./WireframeMarker";

export const Wireframe = React.memo(function WireframeTiles() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { hero, doHeroAction } = useHero();
  const { getWorldMousePosition } = useMousePosition();

  const [mousePosition, setMousePosition] = React.useState(null as unknown as WorldMousePosition);
  const [markerPosition, setMarkerPosition] = React.useState({ x: 0, y: 0 } as GridCoordinates);
  const [markerClassName, setMarkerClassName] = React.useState(["action--allowed"]);
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition(getWorldMousePosition(e));
  };

  const handleClick = () => {
    setMarkerClassName([
      ...markerClassName,
      ...[markerClassName.includes("action--allowed") ? "perform-action--allowed" : "perform-action--not-allowed"],
    ]);

    doHeroAction(mousePosition);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const userActions: Array<Unit["currentSelectedAction"]> = ["walk", "run", "useLeftHand", "useRightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  const updateMarkerColor = () => {
    let className = "action--allowed";

    switch (true) {
      case hero.isUsingHands():
        // eslint-disable-next-line no-case-declarations
        const weapon = hero.getCurrentWeapon();

        if (weapon) {
          weapon.aimAt(mousePosition.grid);

          if (!weapon.isReadyToUse()) {
            className = "action--not-allowed";
            weapon.stopAiming();
          }
        }
        break;

      default:
        if (gameState.calcUnitPath(hero, mousePosition.grid).length === 0) {
          className = "action--not-allowed";
        }
    }

    setMarkerClassName([className]);
  };

  React.useEffect(() => {
    setMousePosition(null as unknown as WorldMousePosition);
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    if (!mousePosition) return;

    setMarkerPosition(mousePosition.grid);
    updateMarkerColor();
  }, [mousePosition?.grid.x, mousePosition?.grid.y]);

  return uiState.scene === "game" ? (
    <div
      className={"wireframe"}
      style={{
        width: gameState.mapSize.width * constants.wireframeTileSize.width,
        height: gameState.mapSize.height * constants.wireframeTileSize.height,
        left: (gameState.mapSize.width * constants.tileSize.width) / 2,
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <WireframeMarker
        coordinates={markerPosition}
        className={markerClassName}
        onAnimationComplete={() => {
          const classes = [...markerClassName];
          classes.pop();

          setMarkerClassName(classes);
        }}
      />
    </div>
  ) : null;
});
