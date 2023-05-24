import { Unit } from "../engine/UnitFactory";
import { getDistanceBetweenGridPoints } from "../engine/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { GameMap } from "../engine/GameMap";

export type HighlightTargetWireframeCellReducerAction = {
  type: "highlightTargetWireframeCell";
  unit: Unit;
  targetPosition: Coordinates;
};

export function highlightTargetWireframeCell(state: GameMap, action: HighlightTargetWireframeCellReducerAction) {
  const weapon = action.unit.getCurrentWeapon();

  if (!weapon) return state;

  state.highlightWireframeCell(action.targetPosition);

  const distance = Math.floor(getDistanceBetweenGridPoints(action.unit.position, action.targetPosition));
  const isAttackAllowed = distance <= weapon.range;
  const value = (isAttackAllowed ? " " : <FontAwesomeIcon icon={faXmark} size={"lg"} />) as TileProps["value"];

  state.setWireframeCellValue(action.targetPosition, value);
  state.setHighlightWireframeCellStyle(action.targetPosition, isAttackAllowed ? "target" : "error");

  return { ...state };
}
