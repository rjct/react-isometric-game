import { getCss3dPosition } from "@src/engine/helpers";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export const VehicleComponent = (props: {
  vehicle: Vehicle;
  highlightedForInventoryTransfer?: boolean;
  selectedForInventoryTransfer?: boolean;
}) => {
  return (
    <div
      draggable={false}
      className={props.vehicle.className}
      id={props.vehicle.id}
      style={{
        transform: getCss3dPosition(props.vehicle.position.screen, false),
        zIndex: props.vehicle.zIndex,
      }}
      data-action={props.vehicle.action}
      data-selected-for-inventory-transfer={
        props.highlightedForInventoryTransfer || props.selectedForInventoryTransfer || null
      }
      data-rotation={props.vehicle.rotation.deg}
    ></div>
  );
};
