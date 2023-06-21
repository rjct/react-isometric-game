import { useGameState } from "./useGameState";
import { Unit } from "../engine/UnitFactory";

import { WorldMousePosition } from "./useMousePosition";
import { constants } from "../constants";
import { Building } from "../engine/BuildingFactory";
import { getDistanceBetweenGridPoints } from "../engine/helpers";

export function useHero() {
  const { uiState, gameState, gameDispatch } = useGameState();
  const hero = gameState.units[gameState.heroId];

  const doHeroAction = (mousePosition: WorldMousePosition) => {
    if (!mousePosition || mousePosition.isOutOfGrid || uiState.scene !== "game") return;

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

  const getHeroScreenPosition = (): ScreenCoordinates => {
    const pos = hero.screenPosition;

    return {
      x: pos.x + constants.tileSize.width / 2,
      y: pos.y - constants.tileSize.height / 2,
    };
  };

  const getHeroMaskImage = (entity: Building) => {
    if (
      entity.class !== "wall" ||
      hero.zIndex > entity.zIndex ||
      hero.zIndex < entity.zIndex - 5 ||
      entity.position.y < hero.position.y ||
      getDistanceBetweenGridPoints(hero.position, entity.position) > 4
    ) {
      return "none";
    }

    const { x, y } = getHeroScreenPosition();
    const entityPosition = entity.screenPosition;
    const maskRadius = hero.size.screen.height / 4;

    return [
      `radial-gradient(circle at ${x - entityPosition.x}px ${
        y - entityPosition.y + hero.size.screen.height / 2
      }px, rgba(0,0,0,0.2) ${maskRadius / 2}px, black ${maskRadius}px)`,
    ].join(",");
  };

  return {
    hero: hero || new Unit({ unitType: "vault13_male", position: { x: 0, y: 0 } }),
    doHeroAction,
    getHeroScreenPosition,
    getHeroMaskImage,
  };
}
