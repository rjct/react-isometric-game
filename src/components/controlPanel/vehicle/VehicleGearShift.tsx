import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export const VehicleGearShift = (props: { vehicle: Vehicle }) => {
  return (
    <div className={"vehicle-gear-shift-wrapper"}>
      <div className={"vehicle-gear-shift"}>
        <div className={"vehicle-gear-shift-mode"} data-active={props.vehicle.gearShiftMode === "reverse"}>
          R
        </div>
        <div className={"vehicle-gear-shift-mode"} data-active={props.vehicle.gearShiftMode === "neutral"}>
          N
        </div>
        <div className={"vehicle-gear-shift-mode"} data-active={props.vehicle.gearShiftMode === "drive"}>
          D
        </div>
      </div>
    </div>
  );
};
