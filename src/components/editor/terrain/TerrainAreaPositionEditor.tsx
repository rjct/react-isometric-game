import { EntityPositionAxisEditor } from "@src/components/editor/_shared/EntityPositionAxisEditor";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainAreaPositionEditor = React.memo((props: { terrainArea: TerrainArea }) => {
  const { terrainDispatch, gameState } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);
  const [size, setSize] = React.useState<Size2D | null>(null);

  React.useEffect(() => {
    if (props.terrainArea) {
      const area = props.terrainArea.target;

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
  }, [JSON.stringify(props.terrainArea)]);

  return coordinates && size ? (
    <>
      <div className={"terrain-area-coordinates-editor"}>
        <EntityPositionAxisEditor
          value={coordinates.x}
          label={"x"}
          min={0}
          max={gameState.mapSize.width - size.width}
          disabled={!props.terrainArea}
          onChange={(value) => {
            terrainDispatch({
              type: "setTerrainAreaPosition",
              entityId: props.terrainArea.id,
              coordinates: { x: value, y: props.terrainArea.target.y1 },
            });
          }}
        />

        <EntityPositionAxisEditor
          value={coordinates.y}
          label={"y"}
          min={0}
          max={gameState.mapSize.height - size.height}
          disabled={!props.terrainArea}
          onChange={(value) => {
            terrainDispatch({
              type: "setTerrainAreaPosition",
              entityId: props.terrainArea.id,
              coordinates: { x: props.terrainArea.target.x1, y: value },
            });
          }}
        />
      </div>
      <div className={"terrain-area-coordinates-editor"}>
        <EntityPositionAxisEditor
          value={size.width}
          label={"W"}
          min={1}
          max={gameState.mapSize.width - props.terrainArea.target.x1}
          disabled={!props.terrainArea}
          onChange={(value) => {
            terrainDispatch({
              type: "setTerrainAreaSize",
              entityId: props.terrainArea.id,
              size: {
                width: value,
                height: props.terrainArea.target.y2 - props.terrainArea.target.y1,
              },
            });
          }}
        />

        <EntityPositionAxisEditor
          value={size.height}
          label={"H"}
          min={1}
          max={gameState.mapSize.height - props.terrainArea.target.y1}
          disabled={!props.terrainArea}
          onChange={(value) => {
            terrainDispatch({
              type: "setTerrainAreaSize",
              entityId: props.terrainArea.id,
              size: {
                width: props.terrainArea.target.x2 - props.terrainArea.target.x1,
                height: value,
              },
            });
          }}
        />
      </div>
    </>
  ) : null;
});
