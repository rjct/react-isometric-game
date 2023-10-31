import { EntityPositionEditor } from "@src/components/editor/_shared/EntityPositionEditor";
import { Building } from "@src/engine/building/BuildingFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function BuildingPositionEditor(props: { building: Building }) {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);

  React.useEffect(() => {
    setCoordinates(props.building ? props.building.position.grid : { x: 0, y: 0 });
  }, [props.building.getHash()]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <EntityPositionEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - props.building.size.grid.width}
        disabled={!props.building}
        onChange={(value) => {
          gameDispatch({
            type: "setBuildingPosition",
            entityId: props.building.id,
            coordinates: { x: value, y: props.building.position.grid.y },
          });
        }}
      />

      <EntityPositionEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - props.building.size.grid.length}
        disabled={!props.building}
        onChange={(value) => {
          gameDispatch({
            type: "setBuildingPosition",
            entityId: props.building.id,
            coordinates: { x: props.building.position.grid.x, y: value },
          });
        }}
      />
    </div>
  ) : null;
}
