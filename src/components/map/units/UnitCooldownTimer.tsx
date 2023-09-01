import { Unit } from "@src/engine/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

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
