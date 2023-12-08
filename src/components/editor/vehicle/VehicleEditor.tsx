import { VehicleComponent } from "@src/components/viewport/layers/userInteraction/vehicles/Vehicle";
import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import React from "react";

export const VehicleEditor = React.memo(function VehicleEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Vehicle,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.entity) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    gameDispatch({
      type: "setVehiclePosition",
      entityId: workingEntity.entity.id,
      coordinates: {
        x: Math.min(
          gameState.mapSize.width - workingEntity.entity.size.grid.width,
          Math.max(0, workingEntity.initialEntityPosition.x - diffX),
        ),
        y: Math.min(
          gameState.mapSize.height - workingEntity.entity.size.grid.width,
          Math.max(0, workingEntity.initialEntityPosition.y - diffY),
        ),
      },
    });
  };

  const handleMouseUp = () => {
    setWorkingEntity({
      initialMousePosition: null as unknown as GridCoordinates,
      initialEntityPosition: null as unknown as GridCoordinates,
      entity: null as unknown as Vehicle,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Vehicle) => {
    gameDispatch({ type: "setSelectedVehicle", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position.grid },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "vehicles" ? (
    <GameLayer
      isometric={false}
      size={gameState.mapSize}
      className={"vehicle-editor"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {gameState.vehicles.map((vehicle) => {
        return (
          <VehicleComponent
            key={vehicle.id}
            vehicle={vehicle}
            selected={vehicle.id === gameState.selectedVehicle?.id}
            dragging={vehicle.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
          />
        );
      })}
    </GameLayer>
  ) : null;
});
