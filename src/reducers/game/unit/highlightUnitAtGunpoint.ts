import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface HighlightUnitAtGunpointReducerAction {
  type: "highlightUnitAtGunpoint";
  unit: Unit;
}

export function highlightUnitAtGunpoint(state: GameMap, action: HighlightUnitAtGunpointReducerAction) {
  const hero = state.getHero();
  const weapon = hero?.getCurrentWeapon();

  const unitAtGunpoint =
    !!weapon &&
    weapon.isReadyToUse(state) &&
    weapon.getAimCoordinates()?.x === action.unit.getRoundedPosition().x &&
    weapon.getAimCoordinates()?.y === action.unit.getRoundedPosition().y;

  action.unit.setAtGunpoint(unitAtGunpoint);

  return { ...state };
}
