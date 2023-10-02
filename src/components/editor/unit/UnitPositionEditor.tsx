import { EntityPositionEditor } from "@src/components/editor/_shared/EntityPositionEditor";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function UnitPositionEditor(props: { unit: Unit }) {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);

  React.useEffect(() => {
    setCoordinates(props.unit.getRoundedPosition());
  }, [props.unit.getHash()]);

  if (!coordinates) return null;

  const handlePositionXChange = (value: number) => {
    gameDispatch({
      type: "setUnitPosition",
      entityId: props.unit.id,
      coordinates: { x: value, y: props.unit.getRoundedPosition().y },
    });
  };

  const handlePositionYChange = (value: number) => {
    gameDispatch({
      type: "setUnitPosition",
      entityId: props.unit.id,
      coordinates: { x: props.unit.getRoundedPosition().x, y: value },
    });
  };

  return (
    <div className={"terrain-area-coordinates-editor"}>
      <EntityPositionEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - 1}
        disabled={!props.unit}
        onChange={handlePositionXChange}
      />

      <EntityPositionEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - 1}
        disabled={!props.unit}
        onChange={handlePositionYChange}
      />
    </div>
  );
}
