import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { BuildingComponent } from "@src/components/viewport/layers/userInteraction/buildings/Building";
import { UnitComponent } from "@src/components/viewport/layers/userInteraction/units/Unit";
import { VehicleComponent } from "@src/components/viewport/layers/userInteraction/vehicles/Vehicle";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { constants } from "@src/engine/constants";
import { getCss3dPosition, gridToScreenSpace } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import React from "react";

export const Editor = React.memo(function Editor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as GameEntity | Light | null,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.entity) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    gameDispatch({
      type: "setEntityPosition",
      entity: workingEntity.entity,
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
      entity: null as unknown as GameEntity | Light,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: GameEntity | Light) => {
    gameDispatch({ type: "setSelectedEntity", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position.grid },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" ? (
    <GameLayer
      isometric={false}
      size={gameState.mapSize}
      className={"editor-viewport"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {gameState.buildings.map((building) => {
        return (
          <BuildingComponent
            key={building.id}
            building={building}
            selected={building.id === gameState.selectedEntity?.id}
            dragging={building.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
            maskImage={"none"}
            style={{
              opacity: uiState.editorMode == "buildings" ? 1 : 0.5,
              pointerEvents: uiState.editorMode == "buildings" ? "auto" : "none",
            }}
          />
        );
      })}

      {gameState.vehicles.map((vehicle) => {
        return (
          <VehicleComponent
            key={vehicle.id}
            vehicle={vehicle}
            selected={vehicle.id === gameState.selectedEntity?.id}
            dragging={vehicle.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
            style={{
              opacity: uiState.editorMode == "vehicles" ? 1 : 0.5,
              pointerEvents: uiState.editorMode == "vehicles" ? "auto" : "none",
            }}
          />
        );
      })}

      {Object.values(gameState.units).map((unit) => {
        return (
          <UnitComponent
            key={unit.id}
            unit={unit}
            selected={unit.id === gameState.selectedEntity?.id}
            dragging={unit.id === workingEntity.entity?.id}
            onMouseDown={handleEntityMouseDown}
            onMouseUp={handleMouseUp}
            style={{
              opacity: uiState.editorMode == "units" ? 1 : 0.5,
              pointerEvents: uiState.editorMode == "units" ? "auto" : "none",
            }}
          />
        );
      })}

      {gameState.lights.map((light) => {
        const width = constants.tileSize.width;
        const height = constants.tileSize.height;

        return (
          <div
            draggable={false}
            className={light.className}
            id={light.id}
            style={{
              position: "absolute",
              marginLeft: width / 4,
              marginTop: -height / 2,
              transform: getCss3dPosition(gridToScreenSpace(light.position.grid, gameState.mapSize), false),
              width: width / 2,
              height,
              background: `radial-gradient(circle at 30% 30%, ${light.getColor()}, rgba(0,0,0,1))`,
              zIndex: light.zIndex,
              opacity: uiState.editorMode == "lights" ? 1 : 0.5,
              pointerEvents: uiState.editorMode == "lights" ? "auto" : "none",
            }}
            key={light.id}
            data-selected={light.id === gameState.selectedEntity?.id}
            data-dragging={light.id === workingEntity.entity?.id}
            onDragStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e: React.MouseEvent) => handleEntityMouseDown(e, light)}
          ></div>
        );
      })}
    </GameLayer>
  ) : null;
});
