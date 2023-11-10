import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const UnitHealth = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (!gameState.debug.enabled || !gameState.debug.featureEnabled.unitInfo || props.unit.isDead) return null;

  return (
    <div className={"health"}>
      <div
        style={{
          width: `${
            (props.unit.characteristics.derived.healthPoints.value * 100) /
            props.unit.characteristics.derived.healthPoints.max
          }%`,
        }}
      ></div>
    </div>
  );
});
