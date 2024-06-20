import { Building } from "@src/engine/building/BuildingFactory";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function useGameEntityInteraction() {
  const { gameState, uiState, uiDispatch } = useGameState();

  const handleEntityMouseMove = (e: React.MouseEvent, entity: Unit | Building | Vehicle) => {
    e.stopPropagation();
    e.preventDefault();

    const entityGridPosition = gameState.getClosestCoordinatesOfEntity(gameState.getHero(), entity); //entity.getRoundedPosition();

    if (
      uiState.mousePosition.grid.x === entityGridPosition.x &&
      uiState.mousePosition.grid.y === entityGridPosition.y
    ) {
      return;
    }

    uiDispatch({
      type: "setMousePosition",
      mousePosition: {
        grid: entityGridPosition,
        screen: gridToScreenSpace(entityGridPosition, gameState.mapSize),
        browser: { x: 0, y: 0 },
        isOutOfGrid: false,
      },
    });
  };

  return { handleEntityMouseMove };
}
