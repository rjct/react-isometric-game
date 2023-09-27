import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const UnitHealth = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (!gameState.debug.enabled || !gameState.debug.featureEnabled.unitInfo || props.unit.isDead) return null;

  return (
    <div className={"health"}>
      <div style={{ width: `${(props.unit.healthPoints.current * 100) / props.unit.healthPoints.max}%` }}></div>
    </div>
  );
});
