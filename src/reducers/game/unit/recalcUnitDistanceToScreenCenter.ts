import { GameUI } from "@src/context/GameUIContext";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";

export type RecalculateUnitDistanceToScreenCenterReducerAction = {
  type: "recalculateUnitDistanceToScreenCenter";
  unit: Unit;
  viewport: GameUI["viewport"];
  scroll: GameUI["scroll"];
};

export function recalculateUnitDistanceToScreenCenter(
  state: GameMap,
  action: RecalculateUnitDistanceToScreenCenterReducerAction,
): GameMap {
  if (state.mapSize.width === 0) return state;

  const { unit, viewport, scroll } = action;

  const screenCenter = (viewport.screen.x2 - viewport.screen.x1) / 2;
  const heroScreenX =
    gridToScreenSpace(unit.position.grid, state.mapSize).x - scroll.x + constants.wireframeTileSize.width / 2;
  const distance = ((heroScreenX * 100) / screenCenter - 100) / 100;

  if (distance < Infinity) {
    unit.setDistanceToScreenCenter(distance);
  }

  return state;
}
