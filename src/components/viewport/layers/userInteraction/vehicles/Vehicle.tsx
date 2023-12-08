import { getCss3dPosition } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useMessages } from "@src/hooks/useMessages";
import React from "react";

export const VehicleComponent = (props: {
  vehicle: Vehicle;
  selected?: boolean;
  dragging?: boolean;
  highlightedForInventoryTransfer?: boolean;
  selectedForInventoryTransfer?: boolean;
  onMouseMove?: (e: React.MouseEvent, entity: Vehicle) => void;
  onMouseDown?: (e: React.MouseEvent, entity: Vehicle) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) => {
  const { gameDispatch } = useGameState();
  const { notify_EntityTakesDamage } = useMessages();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (props.onMouseMove) {
      props.onMouseMove(e, props.vehicle);
    }
  };

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
      props.vehicle.takeDamage(1);

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

  React.useEffect(() => {
    notify_EntityTakesDamage(props.vehicle);
  }, [props.vehicle.damagePoints]);

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
        clipPath: props.vehicle.getClipPath(),
      }}
      data-selected={props.selected || null}
      data-dragging={props.dragging || null}
      data-action={props.vehicle.action}
      data-gear-shift-mode={props.vehicle.gearShiftMode}
      data-selected-for-inventory-transfer={
        props.highlightedForInventoryTransfer || props.selectedForInventoryTransfer || null
      }
      data-rotation={props.vehicle.rotation.deg}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    ></div>
  );
};
