import React from "react";
import { useGameState } from "../../hooks/useGameState";

export function EntityDirection() {
  const { gameState, gameDispatch } = useGameState();

  const [selectedDirection, setSelectedDirection] = React.useState<Direction>("top");
  const directions: Direction[] = gameState.selectedEntity ? gameState.selectedEntity.getAvailableDirections() : [];

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as Direction;

    setSelectedDirection(direction);
    gameDispatch({ type: "setEntityDirection", entityId: gameState.selectedEntity.id, direction });
  };

  React.useEffect(() => {
    setSelectedDirection(gameState.selectedEntity?.direction);
  }, [gameState.selectedEntity]);

  return (
    <select value={selectedDirection} onChange={handleDirectionChange} disabled={!gameState.selectedEntity}>
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
