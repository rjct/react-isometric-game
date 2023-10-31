import { GameScene } from "@src/context/GameUIContext";
import { Building } from "@src/engine/building/BuildingFactory";
import { constants } from "@src/engine/constants";
import { getDistanceBetweenEntities, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import { WorldMousePosition } from "@src/hooks/useMousePosition";

export function useHero() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const hero = gameState.units[gameState.heroId];

  const doHeroAction = (mousePosition: WorldMousePosition, type: "click" | "doubleClick") => {
    if (!mousePosition || mousePosition.isOutOfGrid || !(["game", "combat"] as GameScene[]).includes(uiState.scene))
      return;

    const targetPosition = { ...mousePosition.grid };
    const weapon = hero.getCurrentWeapon();

    switch (hero.currentSelectedAction) {
      case "move":
        hero.currentMovementMode = type === "doubleClick" ? "run" : "walk";

        gameDispatch({
          type: "moveUnit",
          unit: hero,
          position: targetPosition,
          moveAction: hero.currentMovementMode,
        });
        break;

      case "explore":
        const entity = gameState.getEntityByCoordinates(uiState.mousePosition.grid);

        if (entity) {
          if (type === "doubleClick") {
            if (entity instanceof Vehicle) {
              gameDispatch({ type: "getIntoVehicle", unit: hero, vehicle: entity });
            }

            return;
          }

          gameDispatch({ type: "highlightExplorableEntity", entity: null });
          gameDispatch({ type: "setSelectedEntityForInventoryTransfer", entity });

          if (getDistanceBetweenEntities(hero, entity) > 0) {
            gameDispatch({
              type: "moveUnit",
              unit: hero,
              position: hero.getClosestCoordinatesToEntity(entity),
              moveAction: hero.currentMovementMode,
              onUnitMoveFinished: () => {
                uiDispatch({ type: "setScene", scene: "inventoryTransfer" });
              },
            });
          } else {
            uiDispatch({ type: "setScene", scene: "inventoryTransfer" });
          }
        }

        break;

      case "leftHand":
      case "rightHand":
        gameDispatch({
          type: "useEntityInUnitHand",
          unit: hero,
          hand: hero.currentSelectedAction,
          targetPosition,
          consumeActionPoints: uiState.scene === "combat",
        });

        if (weapon) {
          window.setTimeout(() => {
            gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: hero.currentSelectedAction });
          }, weapon.getCurrentAttackModeDetails().animationDuration.attackCompleted);
        }
        break;
    }
  };

  const getHeroScreenPosition = (): ScreenCoordinates => {
    const pos = hero.position.screen;

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
      entity.position.grid.y < hero.position.grid.y ||
      getDistanceBetweenGridPoints(hero.position.grid, entity.position.grid) > 4
    ) {
      return "none";
    }

    const { x, y } = getHeroScreenPosition();
    const entityPosition = entity.position.screen;
    const maskRadius = hero.size.screen.height / 4;

    return [
      `radial-gradient(circle at ${x - entityPosition.x}px ${
        y - entityPosition.y + hero.size.screen.height / 2
      }px, rgba(0,0,0,0.2) ${maskRadius / 2}px, black ${maskRadius}px)`,
    ].join(",");
  };

  return {
    hero: hero || new Unit({ gameState, unitType: "vault13_male", position: { x: 0, y: 0 }, isHero: true }),
    doHeroAction,
    getHeroMaskImage,
  };
}
