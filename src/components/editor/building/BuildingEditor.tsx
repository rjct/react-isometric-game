import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { Building } from "../../../engine/BuildingFactory";
import { BuildingComponent } from "../../map/buildings/Building";
import { MapLayer } from "../../map/MapLayer";

export const BuildingEditor = React.memo(function BuildingEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Building,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.entity) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    gameDispatch({
      type: "setBuildingPosition",
      entityId: workingEntity.entity.id,
      coordinates: {
        x: Math.min(
          gameState.mapSize.width - workingEntity.entity.size.grid.width,
          Math.max(0, workingEntity.initialEntityPosition.x - diffX)
        ),
        y: Math.min(
          gameState.mapSize.height - workingEntity.entity.size.grid.width,
          Math.max(0, workingEntity.initialEntityPosition.y - diffY)
        ),
      },
    });

    gameDispatch({ type: "recalculateLightsAndShadows" });
  };

  const handleMouseUp = () => {
    setWorkingEntity({
      initialMousePosition: null as unknown as GridCoordinates,
      initialEntityPosition: null as unknown as GridCoordinates,
      entity: null as unknown as Building,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Building) => {
    gameDispatch({ type: "setSelectedBuilding", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "buildings" ? (
    <MapLayer
      isometric={false}
      size={gameState.mapSize}
      className={"building-editor"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {gameState.buildings.map((building) => {
        return (
          <BuildingComponent
            key={building.id}
            building={building}
            selected={building.id === gameState.selectedBuilding?.id}
            dragging={building.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
            maskImage={"none"}
          />
        );
      })}
    </MapLayer>
  ) : null;
});
