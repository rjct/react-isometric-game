import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function UnitDirectionSelector() {
  const { gameState, gameDispatch } = useGameState();

  const [selectedDirection, setSelectedDirection] = React.useState<Direction>(gameState.selectedUnit.direction);
  const directions: Direction[] = ["left", "top", "right", "bottom"];

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as Direction;

    setSelectedDirection(direction);
    gameDispatch({ type: "setUnitDirection", entityId: gameState.selectedUnit.id, direction });
    gameDispatch({ type: "recalculateUnitFieldOfView", unit: gameState.selectedUnit });
  };

  React.useEffect(() => {
    setSelectedDirection(gameState.selectedUnit?.direction);
  }, [gameState.selectedUnit]);

  return (
    <select value={selectedDirection} onChange={handleDirectionChange} disabled={!gameState.selectedUnit}>
      {directions.map((direction) => {
        return (
          <option key={direction} value={direction}>
            {direction}
          </option>
        );
      })}
    </select>
  );
}
