import { EntityPositionAxisEditor } from "@src/components/editor/_shared/EntityPositionAxisEditor";
import { Light } from "@src/engine/light/LightFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function LightPositionEditor(props: { light: Light }) {
  const { gameState, gameDispatch } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);

  React.useEffect(() => {
    setCoordinates(props.light ? props.light.position : { x: 0, y: 0 });
  }, [props.light.getHash()]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <EntityPositionAxisEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - 1}
        disabled={!props.light}
        onChange={(value) => {
          gameDispatch({
            type: "setLightPosition",
            entityId: props.light.id,
            coordinates: { x: value, y: props.light.position.y },
          });
        }}
      />

      <EntityPositionAxisEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - 1}
        disabled={!props.light}
        onChange={(value) => {
          gameDispatch({
            type: "setLightPosition",
            entityId: props.light.id,
            coordinates: { x: props.light.position.x, y: value },
          });
          gameDispatch({ type: "recalculateLightsAndShadows" });
        }}
      />
    </div>
  ) : null;
}
