import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";
import { getDistanceBetweenGridPoints } from "../engine/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export type HighlightTargetWireframeCellReducerAction = {
  type: "highlightTargetWireframeCell";
  unit: Unit;
  targetPosition: Coordinates;
};

export function highlightTargetWireframeCell(state: typeof GameMap, action: HighlightTargetWireframeCellReducerAction) {
  const weapon = action.unit.getCurrentWeapon();

  if (!weapon) return state;

  const { x, y } = action.targetPosition;

  state.highlightWireframeCell(x, y);

  const distance = Math.floor(getDistanceBetweenGridPoints(action.unit.position, action.targetPosition));
  const isAttackAllowed = distance <= weapon.range;
  const value = (isAttackAllowed ? " " : <FontAwesomeIcon icon={faXmark} size={"lg"} />) as TileProps["value"];

  state.setWireframeCellValue(x, y, value);
  state.setHighlightWireframeCellStyle(x, y, isAttackAllowed ? "target" : "error");

  return { ...state };
}
