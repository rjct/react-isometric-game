import { getCss3dPosition } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
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

  return (
    <div
      draggable={false}
      className={props.vehicle.className}
      id={props.vehicle.id}
      style={{
        transform: getCss3dPosition(props.vehicle.position.screen, false),
        zIndex: props.vehicle.zIndex,
        animationDuration: `${Math.round(1000 - props.vehicle.speed.current * 20)}ms`,
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
