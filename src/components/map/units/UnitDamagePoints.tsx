import { Unit } from "../../../engine/UnitFactory";
import React from "react";

export function UnitDamagePoints(props: { unit: Unit }) {
  return <div className="damage-points">{props.unit.action === "hit" ? props.unit.damagePoints : ""}</div>;
}
