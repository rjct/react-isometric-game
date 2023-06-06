import { GameMap } from "../../../engine/GameMap";
import { Light } from "../../../engine/LightFactory";

export interface ClearSelectedLightReducerAction {
  type: "clearSelectedLight";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedLight(state: GameMap, action: ClearSelectedLightReducerAction): GameMap {
  return { ...state, ...{ selectedLight: null as unknown as Light } };
}
