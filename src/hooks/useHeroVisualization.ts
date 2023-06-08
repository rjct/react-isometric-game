import React from "react";
import { useGameState } from "./useGameState";
import { useHero } from "./useHero";
import { WorldMousePosition } from "./useMousePosition";
import { useCanvas } from "./useCanvas";

export function useHeroVisualization(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const { gameState, uiState } = useGameState();
  const { hero } = useHero();

  const { clearCanvas, drawCircle } = useCanvas();

  const renderTarget = (mousePosition: WorldMousePosition) => {
    if (!hero || /*hero.isMoving() ||*/ uiState.isScrolling()) return;

    if (/*!hero.isUsingHands() ||*/ mousePosition.isOutOfGrid) return;

    if (props.canvasRef.current) {
      const ctx = props.canvasRef.current.getContext("2d");
      if (!ctx) return;

      clearCanvas(ctx);

      const { x, y } = mousePosition.grid;

      let color = "lightgreen";

      switch (true) {
        case hero.isUsingHands():
          // eslint-disable-next-line no-case-declarations
          const weapon = hero.getCurrentWeapon();

          if (weapon) {
            weapon.aimAt(mousePosition.grid);

            if (!weapon.isReadyToUse()) {
              color = "red";
            }
          }
          break;

        default:
          if (gameState.calcUnitPath(hero, mousePosition.grid).length === 0) {
            color = "red";
          }
      }

      drawCircle(ctx, { x: x, y }, color, undefined, 3);
    }
  };

  return { renderTarget };
}
