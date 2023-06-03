import { useGameState } from "./useGameState";
import { Unit } from "../engine/UnitFactory";

import { WorldMousePosition } from "./useMousePosition";

export function useHero() {
  const { uiState, gameState, gameDispatch } = useGameState();
  const hero = gameState.units[gameState.heroId];

  const doHeroAction = (mousePosition: WorldMousePosition) => {
    if (mousePosition.isOutOfGrid || uiState.scene !== "game") return;

    const targetPosition = { ...mousePosition.grid };
    const weapon = hero.getCurrentWeapon();

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
        gameDispatch({ type: "useEntityInUnitHand", unit: hero, hand: "leftHand", targetPosition });

        if (weapon) {
          window.setTimeout(() => {
            gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: hero.currentSelectedAction });
          }, weapon.animationDuration.attackCompleted);
        }
        break;

      case "useRightHand":
        gameDispatch({ type: "useEntityInUnitHand", unit: hero, hand: "rightHand", targetPosition });

        if (weapon) {
          window.setTimeout(() => {
            gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: hero.currentSelectedAction });
          }, weapon.animationDuration.attackCompleted);
        }
        break;
    }
  };

  return {
    hero: hero || new Unit({ unitType: "hero", position: { x: 0, y: 0 } }),
    doHeroAction,
  };
}
