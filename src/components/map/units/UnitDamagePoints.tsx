import { Unit } from "@src/engine/UnitFactory";
import React from "react";

export const UnitDamagePoints = React.memo((props: { action: Unit["action"]; damagePoints: Unit["damagePoints"] }) => {
  return <div className="damage-points">{props.action === "hit" ? props.damagePoints : ""}</div>;
});
