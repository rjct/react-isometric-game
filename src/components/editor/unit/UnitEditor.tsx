import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { Unit } from "../../../engine/UnitFactory";
import { UnitComponent } from "../../map/units/Unit";
import { MapLayer } from "../../map/MapLayer";

export const UnitEditor = React.memo(function UnitEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Unit,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.entity) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    gameDispatch({
      type: "setUnitPosition",
      entityId: workingEntity.entity.id,
      coordinates: {
        x: Math.min(gameState.mapSize.width - 1, Math.max(0, workingEntity.initialEntityPosition.x - diffX)),
        y: Math.min(gameState.mapSize.height - 1, Math.max(0, workingEntity.initialEntityPosition.y - diffY)),
      },
    });
    gameDispatch({ type: "recalculateUnitFieldOfView", unit: workingEntity.entity });
  };

  const handleMouseUp = () => {
    setWorkingEntity({
      initialMousePosition: null as unknown as GridCoordinates,
      initialEntityPosition: null as unknown as GridCoordinates,
      entity: null as unknown as Unit,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Unit) => {
    gameDispatch({ type: "setSelectedUnit", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.getRoundedPosition() },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "units" ? (
    <MapLayer
      isometric={false}
      size={gameState.mapSize}
      className={"unit-editor"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {Object.values(gameState.units).map((unit) => {
        return (
          <UnitComponent
            key={unit.id}
            unit={unit}
            selected={unit.id === gameState.selectedUnit?.id}
            dragging={unit.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
          />
        );
      })}
    </MapLayer>
  ) : null;
});
