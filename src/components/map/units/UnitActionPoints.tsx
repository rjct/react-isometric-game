import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { useGameState } from "../../../hooks/useGameState";

export const UnitActionPoints = React.memo((props: { unit: Unit }) => {
  const { gameState, uiState } = useGameState();

  if (
    uiState.scene !== "combat" ||
    !gameState.debug.enabled ||
    !gameState.debug.featureEnabled.unitInfo ||
    props.unit.isDead
  )
    return null;

  return (
    <div className={"action-points"}>
      <div style={{ width: `${(props.unit.actionPoints.current * 100) / props.unit.actionPoints.max}%` }}></div>
    </div>
  );
});
