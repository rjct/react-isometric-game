import { PositionEntityEditor } from "@src/components/editor/_shared/PositionEntityEditor";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function UnitPositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState(null as unknown as GridCoordinates);

  React.useEffect(() => {
    if (gameState.selectedUnit) {
      setCoordinates(gameState.selectedUnit.getRoundedPosition());
    } else {
      setCoordinates({ x: 0, y: 0 });
    }
  }, [gameState.selectedUnit.getHash()]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - 1}
        disabled={!gameState.selectedUnit}
        onChange={(value) => {
          gameDispatch({
            type: "setUnitPosition",
            entityId: gameState.selectedUnit.id,
            coordinates: { x: value, y: gameState.selectedUnit.getRoundedPosition().y },
          });
        }}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - 1}
        disabled={!gameState.selectedUnit}
        onChange={(value) => {
          gameDispatch({
            type: "setUnitPosition",
            entityId: gameState.selectedUnit.id,
            coordinates: { x: gameState.selectedUnit.getRoundedPosition().x, y: value },
          });
        }}
      />
    </div>
  ) : null;
}
