import { faEye } from "@fortawesome/free-regular-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Unit } from "@src/engine/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const UnitEnemyInViewMark = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (props.unit.isDead) return null;

  return (
    <div className={"enemy-in-view"}>
      {props.unit.isEnemyDetected(gameState.units[gameState.heroId]) ? <FontAwesomeIcon icon={faEye} /> : null}
    </div>
  );
});
