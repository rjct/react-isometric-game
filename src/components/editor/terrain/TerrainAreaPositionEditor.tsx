import { PositionEntityEditor } from "@src/components/editor/_shared/PositionEntityEditor";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function TerrainAreaPositionEditor() {
  const { terrainState, terrainDispatch, gameState } = useGameState();

  const [coordinates, setCoordinates] = React.useState(null as unknown as GridCoordinates);
  const [size, setSize] = React.useState(null as unknown as Size2D);

  React.useEffect(() => {
    if (terrainState.selectedTerrainArea) {
      const area = terrainState.selectedTerrainArea.target;

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
  }, [JSON.stringify(terrainState.selectedTerrainArea)]);

  return coordinates && size ? (
    <div className={"terrain-area-coordinates-editor"}>
      <PositionEntityEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - size.width}
        disabled={!terrainState.selectedTerrainArea}
        onChange={(value) => {
          terrainDispatch({
            type: "setTerrainAreaPosition",
            entityId: terrainState.selectedTerrainArea.id,
            coordinates: { x: value, y: terrainState.selectedTerrainArea.target.y1 },
          });
        }}
      />

      <PositionEntityEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - size.height}
        disabled={!terrainState.selectedTerrainArea}
        onChange={(value) => {
          terrainDispatch({
            type: "setTerrainAreaPosition",
            entityId: terrainState.selectedTerrainArea.id,
            coordinates: { x: terrainState.selectedTerrainArea.target.x1, y: value },
          });
        }}
      />

      <PositionEntityEditor
        value={size.width}
        label={"width"}
        min={1}
        max={gameState.mapSize.width - terrainState.selectedTerrainArea.target.x1}
        disabled={!terrainState.selectedTerrainArea}
        onChange={(value) => {
          terrainDispatch({
            type: "setTerrainAreaSize",
            entityId: terrainState.selectedTerrainArea.id,
            size: {
              width: value,
              height: terrainState.selectedTerrainArea.target.y2 - terrainState.selectedTerrainArea.target.y1,
            },
          });
        }}
      />

      <PositionEntityEditor
        value={size.height}
        label={"height"}
        min={1}
        max={gameState.mapSize.height - terrainState.selectedTerrainArea.target.y1}
        disabled={!terrainState.selectedTerrainArea}
        onChange={(value) => {
          terrainDispatch({
            type: "setTerrainAreaSize",
            entityId: terrainState.selectedTerrainArea.id,
            size: {
              width: terrainState.selectedTerrainArea.target.x2 - terrainState.selectedTerrainArea.target.x1,
              height: value,
            },
          });
        }}
      />
    </div>
  ) : null;
}
