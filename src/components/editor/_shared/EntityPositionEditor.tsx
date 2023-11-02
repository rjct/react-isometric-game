import { EntityPositionAxisEditor } from "@src/components/editor/_shared/EntityPositionAxisEditor";
import { Building } from "@src/engine/building/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function EntityPositionEditor(props: {
  entity: Unit | Building | Vehicle;
  onChange: (coordinates: GridCoordinates) => void;
}) {
  const { gameState } = useGameState();

  const [coordinates, setCoordinates] = React.useState<GridCoordinates | null>(null);

  const handlePositionXChange = (value: number) => {
    props.onChange({ x: value, y: props.entity.getRoundedPosition().y });
  };

  const handlePositionYChange = (value: number) => {
    props.onChange({ x: props.entity.getRoundedPosition().x, y: value });
  };

  React.useEffect(() => {
    setCoordinates(props.entity ? props.entity.position.grid : { x: 0, y: 0 });
  }, [props.entity.getHash()]);

  return coordinates ? (
    <div className={"terrain-area-coordinates-editor"}>
      <EntityPositionAxisEditor
        value={coordinates.x}
        label={"x"}
        min={0}
        max={gameState.mapSize.width - props.entity.size.grid.width}
        disabled={!props.entity}
        onChange={handlePositionXChange}
      />

      <EntityPositionAxisEditor
        value={coordinates.y}
        label={"y"}
        min={0}
        max={gameState.mapSize.height - props.entity.size.grid.length}
        disabled={!props.entity}
        onChange={handlePositionYChange}
      />
    </div>
  ) : null;
}
