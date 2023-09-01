import { constants } from "@src/constants";
import { GameUI } from "@src/context/GameUIContext";
import { GameMap } from "@src/engine/GameMap";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Unit } from "@src/engine/UnitFactory";

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
