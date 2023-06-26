import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { useGameState } from "../../../hooks/useGameState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons/faEye";

export const UnitEnemyInViewMark = React.memo((props: { unit: Unit }) => {
  const { gameState } = useGameState();

  if (props.unit.isDead) return null;

  return (
    <div className={"enemy-in-view"}>
      {props.unit.isEnemyDetected(gameState.units[gameState.heroId]) ? <FontAwesomeIcon icon={faEye} /> : null}
    </div>
  );
});
