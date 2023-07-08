import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { useGameState } from "../../../hooks/useGameState";

export const UnitCooldownTimer = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (!gameState.debug.enabled || !gameState.debug.featureEnabled.unitInfo || props.unit.isHero || props.unit.isDead)
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
});
