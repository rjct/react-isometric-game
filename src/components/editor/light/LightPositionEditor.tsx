import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { PositionEntityEditor } from "../_shared/PositionEntityEditor";

export function LightPositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState(null as unknown as GridCoordinates);

  React.useEffect(() => {
    if (gameState.selectedLight) {
      setCoordinates(gameState.selectedLight.position);
    } else {
      setCoordinates({ x: 0, y: 0 });
    }
  }, [JSON.stringify(gameState.selectedLight)]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - 1}
        disabled={!gameState.selectedLight}
        onChange={(value) => {
          gameDispatch({
            type: "setLightPosition",
            entityId: gameState.selectedLight.id,
            coordinates: { x: value, y: gameState.selectedLight.position.y },
          });
        }}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - 1}
        disabled={!gameState.selectedLight}
        onChange={(value) => {
          gameDispatch({
            type: "setLightPosition",
            entityId: gameState.selectedLight.id,
            coordinates: { x: gameState.selectedLight.position.x, y: value },
          });
        }}
      />
    </div>
  ) : null;
}
