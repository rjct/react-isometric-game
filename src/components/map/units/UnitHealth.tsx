import { Unit } from "../../../engine/UnitFactory";
import React from "react";
import { useGameState } from "../../../hooks/useGameState";

export const UnitHealth = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (!gameState.debug.enabled || !gameState.debug.featureEnabled.unitInfo || props.unit.isDead) return null;

  return (
    <div className={"health"}>
      <div style={{ width: `${(props.unit.healthPoints.current * 100) / props.unit.healthPoints.max}%` }}></div>
    </div>
  );
});
