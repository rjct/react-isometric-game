import { getCss3dPosition } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const VehicleComponent = (props: {
  vehicle: Vehicle;
  selected?: boolean;
  dragging?: boolean;
  highlightedForInventoryTransfer?: boolean;
  selectedForInventoryTransfer?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Vehicle) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) => {
  const { gameDispatch } = useGameState();
  const handleMouseDown = (e: React.MouseEvent) => {
    if (props.onMouseDown) {
      props.onMouseDown(e, props.vehicle);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (props.onMouseUp) {
      props.onMouseUp(e);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  React.useEffect(() => {
    if (props.vehicle.action === "collision") {
      gameDispatch({ type: "handleVehicleCollision", vehicle: props.vehicle });

      window.setTimeout(
        () => {
          props.vehicle.setAction("idle");

          gameDispatch({
            type: "setVehicleRotation",
            entityId: props.vehicle.id,
            rotation: props.vehicle.rotation.deg + 11.25,
          });
        },
        props.vehicle.dictEntity?.animationDuration.collision,
      );
    }
  }, [props.vehicle.action]);

  return (
    <div
      draggable={false}
      className={props.vehicle.className}
      id={props.vehicle.id}
      style={{
        transform: getCss3dPosition(props.vehicle.position.screen, false),
        zIndex: props.vehicle.zIndex,
        animationDuration:
          props.vehicle.action === "driving" ? `${Math.round(1000 - props.vehicle.speed.current * 20)}ms` : undefined,
      }}
      data-selected={props.selected || null}
      data-dragging={props.dragging || null}
      data-action={props.vehicle.action}
      data-selected-for-inventory-transfer={
        props.highlightedForInventoryTransfer || props.selectedForInventoryTransfer || null
      }
      data-rotation={props.vehicle.rotation.deg}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    ></div>
  );
};
