import { constants } from "../../../constants";
import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { Light } from "../../../engine/LightFactory";

export const LightEditor = React.memo(function LightEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  const { getWorldMousePosition } = useMousePosition();

  const [workingEntity, setWorkingEntity] = React.useState({
    mode: null as unknown as "move",
    initialMousePosition: null as unknown as Coordinates,
    initialEntityPosition: null as unknown as Coordinates,
    entity: null as unknown as Light,
  });

  const wireframeTileWidth = constants.wireframeTileSize.width;
  const wireframeTileHeight = constants.wireframeTileSize.height;

  const mapWidth = gameState.mapSize.width;
  const mapHeight = gameState.mapSize.height;

  const tileWidth = constants.tileSize.width;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workingEntity.mode) return;

    const mousePosition = getWorldMousePosition(e);

    const diffX = workingEntity.initialMousePosition.x - mousePosition.grid.x;
    const diffY = workingEntity.initialMousePosition.y - mousePosition.grid.y;

    switch (workingEntity.mode) {
      case "move":
        gameDispatch({
          type: "setLightPosition",
          entityId: workingEntity.entity.id,
          coordinates: {
            x: Math.min(gameState.mapSize.width, Math.max(0, workingEntity.initialEntityPosition.x - diffX)),
            y: Math.min(gameState.mapSize.height, Math.max(0, workingEntity.initialEntityPosition.y - diffY)),
          },
        });

        break;
    }
  };

  const handleMouseUp = () => {
    setWorkingEntity({
      mode: null as unknown as "move",
      initialMousePosition: null as unknown as Coordinates,
      initialEntityPosition: null as unknown as Coordinates,
      entity: null as unknown as Light,
    });
  };

  const handleEntityMouseDown = (e: React.MouseEvent, entity: Light) => {
    gameDispatch({ type: "setSelectedLight", entity });

    const mousePosition = getWorldMousePosition(e);

    setWorkingEntity({
      mode: "move",
      initialMousePosition: { ...mousePosition.grid },
      initialEntityPosition: { ...entity.position },
      entity,
    });

    e.stopPropagation();
  };

  return uiState.scene == "editor" && uiState.editorMode == "light" ? (
    <div
      className="lights light-editor"
      style={{
        width: mapWidth * wireframeTileWidth,
        height: mapHeight * wireframeTileHeight,
        left: (mapWidth * tileWidth) / 2,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      data-editing-mode={workingEntity.mode}
    >
      {gameState.lights.map((light) => {
        const position = { x: light.position.x * wireframeTileWidth, y: light.position.y * wireframeTileHeight }; //gameState.gridToScreenSpace(light.position);
        const width = wireframeTileWidth;
        const height = wireframeTileHeight;

        return (
          <div
            className={light.className}
            id={light.id}
            style={{
              left: position.x + width / 2,
              top: position.y + height / 2,
              width,
              height,
              background: `radial-gradient(circle at 30% 30%, ${light.getColor()}, rgba(0,0,0,0.5))`,
            }}
            key={light.id}
            data-selected={light.id === gameState.selectedLight?.id}
            data-dragging={light.id === workingEntity.entity?.id}
            onMouseDown={(e: React.MouseEvent) => handleEntityMouseDown(e, light)}
          ></div>
        );
      })}
    </div>
  ) : null;
});
