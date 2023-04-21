import { pathFinder } from "../engine/pathFinder";
import { useGameState } from "./useGameState";

export function useHero() {
  const { uiState, gameState, gameDispatch } = useGameState();
  const hero = gameState.units[gameState.heroId];

  const centerMapOnHero = () => {
    const unitCoordinates = gameState.gridToScreenSpace(hero.position);

    const viewport = uiState.viewport;

    uiState.setScroll({
      x: unitCoordinates.x - (viewport.x2 - viewport.x1) / 2,
      y: unitCoordinates.y - (viewport.y2 - viewport.y1) / 2,
    });
  };

  const highlightHeroPath = () => {
    if (!hero || hero.isMoving() || uiState.isScrolling()) return;

    gameState.clearHighlightWireframePath();

    if (hero.isUsingHands() || uiState.mousePosition.isOutOfGrid) return;

    const unitPath = pathFinder(gameState.matrix, hero.position, uiState.mousePosition.grid);

    gameDispatch({
      type: "highlightUnitPath",
      unit: hero,
      path: unitPath,
    });
  };

  const highlightTargetWireframeCell = () => {
    if (!hero || hero.isMoving() || uiState.isScrolling()) return;

    gameState.clearHighlightWireframePath();

    if (!hero.isUsingHands() || uiState.mousePosition.isOutOfGrid) return;

    gameDispatch({
      type: "highlightTargetWireframeCell",
      unit: hero,
      targetPosition: uiState.mousePosition.grid,
    });
  };

  const doHeroAction = () => {
    if (uiState.mousePosition.isOutOfGrid) return;

    const targetPosition = { ...uiState.mousePosition.grid };

    switch (hero.currentSelectedAction) {
      case "walk":
        gameDispatch({
          type: "moveUnit",
          unit: hero,
          position: targetPosition,
          moveAction: "walk",
        });
        break;

      case "run":
        gameDispatch({
          type: "moveUnit",
          unit: hero,
          position: targetPosition,
          moveAction: "run",
        });
        break;

      case "useLeftHand":
        hero.hands.left?.fire(targetPosition);
        break;

      case "useRightHand":
        hero.hands.right?.fire(targetPosition);
        break;
    }
  };

  return { hero, centerMapOnHero, highlightHeroPath, highlightTargetWireframeCell, doHeroAction };
}
