import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";

export const UnitCooldownTimer = (props: { unit: Unit }) => {
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
};
