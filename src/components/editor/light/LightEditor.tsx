import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/engine/constants";
import { Light } from "@src/engine/light/LightFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import React from "react";

export const LightEditor = React.memo(function LightEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Light,
  });

  const [selectedEntityPosition, setSelectedEntityPosition] = React.useState(null as unknown as GridCoordinates);

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.entity) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    setSelectedEntityPosition({
      x: Math.min(gameState.mapSize.width, Math.max(0, workingEntity.initialEntityPosition.x - diffX)),
      y: Math.min(gameState.mapSize.height, Math.max(0, workingEntity.initialEntityPosition.y - diffY)),
    });
  };

  const handleMouseUp = () => {
    if (!workingEntity.entity) return;

    gameDispatch({
      type: "setLightPosition",
      entityId: workingEntity.entity.id,
      coordinates: selectedEntityPosition,
    });

    gameDispatch({ type: "recalculateLightsAndShadows" });

    setWorkingEntity({
      initialMousePosition: null as unknown as GridCoordinates,
      initialEntityPosition: null as unknown as GridCoordinates,
      entity: null as unknown as Light,
    });

    setSelectedEntityPosition(null as unknown as GridCoordinates);
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Light) => {
    gameDispatch({ type: "setSelectedLight", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position },
      entity,
    });

    setSelectedEntityPosition(entity.position);

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "lights" ? (
    <MapLayer
      size={gameState.mapSize}
      className={"lights light-editor"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {gameState.lights.map((light) => {
        const position = gameState.convertToIsometricCoordinates(
          workingEntity.entity?.id === light.id ? selectedEntityPosition : light.position,
          true,
        );
        const width = wireframeTileWidth;
        const height = wireframeTileHeight;

        return (
          <div
            draggable={false}
            className={light.className}
            id={light.id}
            style={{
              left: position.x,
              top: position.y,
              width,
              height,
              background: `radial-gradient(circle at 30% 30%, ${light.getColor()}, rgba(0,0,0,0.5))`,
            }}
            key={light.id}
            data-selected={light.id === gameState.selectedLight?.id}
            data-dragging={light.id === workingEntity.entity?.id}
            onDragStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e: React.MouseEvent) => handleEntityMouseDown(e, light)}
          ></div>
        );
      })}
    </MapLayer>
  ) : null;
});
