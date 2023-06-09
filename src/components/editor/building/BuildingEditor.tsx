import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { Building } from "../../../engine/BuildingFactory";
import { BuildingComponent } from "../../map/buildings/Building";

export const BuildingEditor = React.memo(function BuildingEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    mode: null as unknown as "move",
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Building,
  });

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.mode) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    switch (workingEntity.mode) {
      case "move":
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

        break;
    }
  };

  const handleMouseUp = () => {
    setWorkingEntity({
      mode: null as unknown as "move",
      initialMousePosition: null as unknown as GridCoordinates,
      initialEntityPosition: null as unknown as GridCoordinates,
      entity: null as unknown as Building,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Building) => {
    gameDispatch({ type: "setSelectedBuilding", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      mode: "move",
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "building" ? (
    <div
      className="building-editor"
      style={{
        width: mapWidth * constants.tileSize.width,
        height: mapHeight * constants.tileSize.height,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      data-editing-mode={workingEntity.mode}
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
          />
        );
      })}
    </div>
  ) : null;
});
