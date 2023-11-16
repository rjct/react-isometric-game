import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import React from "react";

export const EntityDamagePoints = React.memo(
  (props: { action: Unit["action"] | Vehicle["action"]; damagePoints: number }) => {
    return (
      <div className="damage-points">
        {(props.action === "hit" || props.action === "collision") && props.damagePoints ? props.damagePoints : ""}
      </div>
    );
  },
);
