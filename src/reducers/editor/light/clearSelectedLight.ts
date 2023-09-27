import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";

export interface ClearSelectedLightReducerAction {
  type: "clearSelectedLight";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedLight(state: GameMap, action: ClearSelectedLightReducerAction): GameMap {
  return { ...state, ...{ selectedLight: null as unknown as Light } };
}
