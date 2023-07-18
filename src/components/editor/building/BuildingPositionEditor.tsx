import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { PositionEntityEditor } from "../_shared/PositionEntityEditor";

export function BuildingPositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState(null as unknown as GridCoordinates);

  React.useEffect(() => {
    if (gameState.selectedBuilding) {
      setCoordinates(gameState.selectedBuilding.position);
    } else {
      setCoordinates({ x: 0, y: 0 });
    }
  }, [JSON.stringify(gameState.selectedBuilding)]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - gameState.selectedBuilding.size.grid.width}
        disabled={!gameState.selectedBuilding}
        onChange={(value) => {
          gameDispatch({
            type: "setBuildingPosition",
            entityId: gameState.selectedBuilding.id,
            coordinates: { x: value, y: gameState.selectedBuilding.position.y },
          });

          gameDispatch({ type: "recalculateLightsAndShadows" });
        }}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - gameState.selectedBuilding.size.grid.length}
        disabled={!gameState.selectedBuilding}
        onChange={(value) => {
          gameDispatch({
            type: "setBuildingPosition",
            entityId: gameState.selectedBuilding.id,
            coordinates: { x: gameState.selectedBuilding.position.x, y: value },
          });

          gameDispatch({ type: "recalculateLightsAndShadows" });
        }}
      />
    </div>
  ) : null;
}
