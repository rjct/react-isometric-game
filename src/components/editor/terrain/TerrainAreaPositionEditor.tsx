import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { PositionEntityEditor } from "../PositionEntityEditor";

export function TerrainAreaPositionEditor() {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState(null as unknown as Coordinates);
  const [size, setSize] = React.useState(null as unknown as Size);

  React.useEffect(() => {
    if (gameState.selectedTerrainArea) {
      const area = gameState.selectedTerrainArea.target;

      setSize({
        width: area.x2 - area.x1,
        height: area.y2 - area.y1,
      });

      setCoordinates({
        x: area.x1,
        y: area.y1,
      });
    } else {
      setSize({ width: 0, height: 0 });
      setCoordinates({ x: 0, y: 0 });
    }
  }, [JSON.stringify(gameState.selectedTerrainArea)]);

  return coordinates && size ? (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - size.width}
        disabled={!gameState.selectedTerrainArea}
        onChange={(value) => {
          gameDispatch({
            type: "setTerrainAreaPosition",
            entityId: gameState.selectedTerrainArea.id,
            coordinates: { x: value, y: gameState.selectedTerrainArea.target.y1 },
          });
        }}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - size.height}
        disabled={!gameState.selectedTerrainArea}
        onChange={(value) => {
          gameDispatch({
            type: "setTerrainAreaPosition",
            entityId: gameState.selectedTerrainArea.id,
            coordinates: { x: gameState.selectedTerrainArea.target.x1, y: value },
          });
        }}
      />

      <PositionEntityEditor
        value={size.width}
        label={"width"}
        min={1}
        max={gameState.mapSize.width - gameState.selectedTerrainArea.target.x1}
        disabled={!gameState.selectedTerrainArea}
        onChange={(value) => {
          gameDispatch({
            type: "setTerrainAreaSize",
            entityId: gameState.selectedTerrainArea.id,
            size: {
              width: value,
              height: gameState.selectedTerrainArea.target.y2 - gameState.selectedTerrainArea.target.y1,
            },
          });
        }}
      />

      <PositionEntityEditor
        value={size.height}
        label={"height"}
        min={1}
        max={gameState.mapSize.height - gameState.selectedTerrainArea.target.y1}
        disabled={!gameState.selectedTerrainArea}
        onChange={(value) => {
          gameDispatch({
            type: "setTerrainAreaSize",
            entityId: gameState.selectedTerrainArea.id,
            size: {
              width: gameState.selectedTerrainArea.target.x2 - gameState.selectedTerrainArea.target.x1,
              height: value,
            },
          });
        }}
      />
    </div>
  ) : null;
}
