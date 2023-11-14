import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type SetSPECIALPointsReducerAction = {
  type: "setSPECIALPoints";
  unit: Unit;
  name: UnitPrimaryStatName;
  value: number;
};

export function setSPECIALPoints(state: GameMap, action: SetSPECIALPointsReducerAction): GameMap {
  const { unit } = action;

  unit.characteristics.availablePoints -= action.value;
  unit.characteristics.SPECIAL[action.name].value += action.value;

  return { ...state };
}
