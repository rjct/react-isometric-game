import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function BuildingDirectionSelector() {
  const { gameState, gameDispatch } = useGameState();

  const [selectedDirection, setSelectedDirection] = React.useState<Direction>("top");
  const directions: Direction[] = gameState.selectedBuilding ? gameState.selectedBuilding.getAvailableDirections() : [];

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as Direction;

    setSelectedDirection(direction);
    gameDispatch({ type: "setBuildingDirection", entityId: gameState.selectedBuilding.id, direction });
  };

  React.useEffect(() => {
    setSelectedDirection(gameState.selectedBuilding?.direction);
  }, [gameState.selectedBuilding]);

  return (
    <select value={selectedDirection} onChange={handleDirectionChange} disabled={!gameState.selectedBuilding}>
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
