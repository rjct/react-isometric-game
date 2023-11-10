import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { GameMap } from "@src/engine/gameMap";

export type SetSPECIALPointsReducerAction = {
  type: "setSPECIALPoints";
  name: UnitPrimaryStatName;
  value: number;
};

export function setSPECIALPoints(state: GameMap, action: SetSPECIALPointsReducerAction): GameMap {
  const hero = state.getHero();

  hero.characteristics.availablePoints -= action.value;
  hero.characteristics.SPECIAL[action.name].value += action.value;

  return { ...state };
}
