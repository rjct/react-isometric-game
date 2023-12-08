import { UnitComponent } from "@src/components/map/layers/userInteraction/units/Unit";
import { MapLayer } from "@src/components/map/_shared/MapLayer";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const UnitEditor = React.memo(function UnitEditor() {
  const { gameState, gameDispatch } = useGameState();

  const { getWorldMousePosition } = useMousePosition();
  const { checkCurrentScene } = useScene();
  const { checkEditorMode } = useEditor();

  const [workingEntity, setWorkingEntity] = React.useState({
    initialMousePosition: null as unknown as GridCoordinates,
    initialEntityPosition: null as unknown as GridCoordinates,
    entity: null as unknown as Unit,
  });

  if (!(checkCurrentScene(["editor"]) && checkEditorMode(["units"]))) return null;

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

  return (
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
  );
});
