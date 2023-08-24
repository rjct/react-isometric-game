import { Unit } from "../../../engine/UnitFactory";
import { GameMap } from "../../../engine/GameMap";
import { GameUI } from "../../../context/GameUIContext";
import { gridToScreenSpace } from "../../../engine/helpers";
import { constants } from "../../../constants";

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
  const { unit, viewport, scroll } = action;

  const screenCenter = (viewport.x2 - viewport.x1) / 2;
  const heroScreenX =
    gridToScreenSpace(unit.position, state.mapSize).x - scroll.x + constants.wireframeTileSize.width / 2;
  const distance = ((heroScreenX * 100) / screenCenter - 100) / 100;

  unit.setDistanceToScreenCenter(distance);

  return state;
}
