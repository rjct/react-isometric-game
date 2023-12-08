import { faHand } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons/faTruckFast";
import { Building } from "@src/engine/building/BuildingFactory";
import { constants } from "@src/engine/constants";
import { getDistanceBetweenEntities, getDistanceBetweenGridPoints } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";

export const heroActionTypes = {
  move: { icon: faQuestion },
  leftHand: { icon: faQuestion },
  rightHand: { icon: faQuestion },
  loot: { icon: faHand },
  getIntoVehicle: { icon: faTruckFast },
  driveVehicle: { icon: faQuestion },
};

export type HeroActionType = keyof typeof heroActionTypes;
export type UserEventType = "mouseDown" | "click" | "mouseUp" | "doubleClick";

export type HeroAction = {
  position: GridCoordinates;
  action: HeroActionType;
  entity: Unit | Building | Vehicle | null;
  isAllowed: boolean;
  possibleUserEventTypes: UserEventType[];
  probability?: number;
};

export function useHero() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const hero = gameState.units[gameState.heroId];

  const getPossibleHeroActions = (coordinates: GridCoordinates): Array<HeroAction> => {
    if (
      !hero ||
      coordinates.x < 0 ||
      coordinates.x > gameState.mapSize.width ||
      coordinates.y < 0 ||
      coordinates.y > gameState.mapSize.height
    ) {
      return [];
    }

    switch (true) {
      case !hero.isVehicleInUse() && hero.currentSelectedAction === "move":
        const unitPath = gameState.calcMovementPath(hero.position.grid, coordinates);

        return [
          {
            position: coordinates,
            action: "move",
            entity: null,
            isAllowed: !(
              unitPath.length === 0 ||
              (uiState.scene === "combat" &&
                hero.actionPoints.current / hero.getCurrentActionPointsConsumption() < unitPath.length - 1)
            ),
            possibleUserEventTypes: ["click", "doubleClick"],
          },
        ];

      case !hero.isVehicleInUse() && hero.currentSelectedAction === "leftHand":
      case !hero.isVehicleInUse() && hero.currentSelectedAction === "rightHand":
        const weapon = hero.getCurrentWeapon();

        if (weapon) {
          weapon.stopAiming();
          weapon.aimAt(uiState.mousePosition.grid);

          return [
            {
              position: coordinates,
              action: hero.currentSelectedAction,
              entity: null,
              probability: hero.characteristics.skills[weapon.getCurrentAttackModeDetails().skill].value,
              isAllowed: !(
                !weapon.isReadyToUse(gameState) ||
                (uiState.scene === "combat" &&
                  weapon.getCurrentAttackModeDetails().actionPointsConsumption > hero.actionPoints.current)
              ),
              possibleUserEventTypes: ["click"],
            },
          ];
        }

        return [
          {
            position: coordinates,
            action: hero.currentSelectedAction,
            entity: null,
            isAllowed: false,
            possibleUserEventTypes: ["click"],
          },
        ];

      case !hero.isVehicleInUse() && hero.currentSelectedAction === "loot":
        const entity = gameState.getEntityByCoordinates(uiState.mousePosition.grid);

        if (!entity) {
          return [
            {
              position: coordinates,
              action: "loot",
              entity: null,
              isAllowed: false,
              possibleUserEventTypes: ["click"],
            },
          ];
        }

        const isDrivable = entity && entity instanceof Vehicle;
        const isLootable = entity && entity.isLootable() && entity.id !== hero.id;
        const entityCenter = entity.getRoundedCenterPosition();

        if (isDrivable) {
          return [
            { position: entityCenter, action: "loot", entity, isAllowed: true, possibleUserEventTypes: ["click"] },
            {
              position: entityCenter,
              action: "getIntoVehicle",
              entity,
              isAllowed: true,
              possibleUserEventTypes: ["doubleClick"],
            },
          ];
        } else {
          return [
            {
              position: entityCenter,
              action: "loot",
              entity,
              isAllowed: isLootable,
              possibleUserEventTypes: ["click"],
            },
          ];
        }

      case hero.isVehicleInUse():
        const vehicle = hero.getVehicleInUse()!;
        const path = gameState.calcMovementPath(vehicle.position.grid, coordinates);
        const isAllowed = path.length > 0;

        return [
          {
            position: coordinates,
            action: "driveVehicle",
            entity: null,
            isAllowed,
            possibleUserEventTypes: ["mouseDown", "mouseUp"],
          },
        ];

      default:
        return [];
    }
  };

  const doHeroAction = (type: UserEventType, heroAction?: HeroAction): Promise<HeroActionType> => {
    return new Promise((resolve, reject) => {
      if (!heroAction || !heroAction.isAllowed) return reject();

      switch (heroAction.action) {
        case "move":
          hero.currentMovementMode = type === "doubleClick" ? "run" : "walk";

          gameDispatch({
            type: "moveUnit",
            unit: hero,
            position: heroAction.position,
            moveAction: hero.currentMovementMode,
          });

          return resolve(heroAction.action);

        case "leftHand":
        case "rightHand":
          const weapon = hero.getCurrentWeapon();

          gameDispatch({
            type: "useEntityInUnitHand",
            unit: hero,
            hand: heroAction.action,
            targetPosition: heroAction.position,
            consumeActionPoints: uiState.scene === "combat",
          });

          if (weapon) {
            window.setTimeout(() => {
              gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: hero.currentSelectedAction });
            }, weapon.getCurrentAttackModeDetails().animationDuration.attackCompleted);
          }

          return resolve(heroAction.action);

        case "loot":
          gameDispatch({ type: "highlightExplorableEntity", entity: null });
          gameDispatch({ type: "setSelectedEntityForInventoryTransfer", entity: heroAction.entity });

          if (getDistanceBetweenEntities(hero, heroAction.entity!) > 0) {
            gameDispatch({
              type: "moveUnit",
              unit: hero,
              position: gameState.getClosestCoordinatesToEntity(hero, heroAction.entity!),
              moveAction: hero.currentMovementMode,
              onUnitMoveFinished: () => {
                uiDispatch({ type: "setScene", scene: "inventoryTransfer" });
              },
            });
          } else {
            uiDispatch({ type: "setScene", scene: "inventoryTransfer" });
          }

          return resolve(heroAction.action);

        case "getIntoVehicle":
          gameDispatch({ type: "highlightExplorableEntity", entity: null });
          gameDispatch({ type: "setSelectedEntityForInventoryTransfer", entity: null });

          if (getDistanceBetweenEntities(hero, heroAction.entity!) > 0) {
            gameDispatch({
              type: "moveUnit",
              unit: hero,
              position: gameState.getClosestCoordinatesToEntity(hero, heroAction.entity!),
              moveAction: hero.currentMovementMode,
              onUnitMoveFinished: () => {
                gameDispatch({ type: "getIntoVehicle", unit: hero, vehicle: heroAction.entity as Vehicle });
              },
            });
          } else {
            gameDispatch({ type: "getIntoVehicle", unit: hero, vehicle: heroAction.entity as Vehicle });
          }

          return resolve("getIntoVehicle");

        case "driveVehicle":
          const vehicle = hero.getVehicleInUse()!;

          if (type === "mouseDown") {
            gameDispatch({ type: "startVehicleAcceleration", vehicle, targetPosition: uiState.mousePosition.grid });
          } else if (type === "mouseUp") {
            gameDispatch({ type: "stopVehicleAcceleration", vehicle });
          }

          return resolve("driveVehicle");
      }
    });
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
    getPossibleHeroActions,
    getHeroMaskImage,
  };
}
