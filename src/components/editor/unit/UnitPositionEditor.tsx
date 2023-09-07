import { PositionEntityEditor } from "@src/components/editor/_shared/PositionEntityEditor";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function UnitPositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);

  React.useEffect(() => {
    setCoordinates(gameState.selectedUnit ? gameState.selectedUnit.getRoundedPosition() : null);
  }, [gameState.selectedUnit.getHash()]);

  if (!coordinates) return null;

  const handlePositionXChange = (value: number) => {
    gameDispatch({
      type: "setUnitPosition",
      entityId: gameState.selectedUnit.id,
      coordinates: { x: value, y: gameState.selectedUnit.getRoundedPosition().y },
    });
  };

  const handlePositionYChange = (value: number) => {
    gameDispatch({
      type: "setUnitPosition",
      entityId: gameState.selectedUnit.id,
      coordinates: { x: gameState.selectedUnit.getRoundedPosition().x, y: value },
    });
  };

  return (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - 1}
        disabled={!gameState.selectedUnit}
        onChange={handlePositionXChange}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - 1}
        disabled={!gameState.selectedUnit}
        onChange={handlePositionYChange}
      />
    </div>
  );
}
