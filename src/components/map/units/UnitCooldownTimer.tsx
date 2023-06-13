import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { useGameState } from "../../../hooks/useGameState";

export function UnitCooldownTimer(props: { unit: Unit }) {
  const { gameState, uiState } = useGameState();

  if (!gameState.debug.enabled || uiState.scene !== "game" || props.unit.id === gameState.heroId || props.unit.isDead)
    return null;

  return (
    <div
      className={"cooldown"}
      style={{
        background: `conic-gradient(green ${
          100 - (100 / props.unit.coolDownTime) * props.unit.coolDownTimer
        }%, lightgreen 0)`,
      }}
    ></div>
  );
}
