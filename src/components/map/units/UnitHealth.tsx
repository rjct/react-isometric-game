import { Unit } from "../../../engine/UnitFactory";
import React from "react";
import { useGameState } from "../../../hooks/useGameState";

export function UnitHealth(props: { unit: Unit }) {
  const { gameState } = useGameState();

  if (!gameState.debug.enabled || props.unit.isDead) return null;

  return (
    <div className={"health"}>
      <div style={{ width: `${(props.unit.healthPoints.current * 100) / props.unit.healthPoints.max}%` }}></div>
    </div>
  );
}
