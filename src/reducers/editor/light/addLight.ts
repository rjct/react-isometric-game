import { GameMap } from "../../../engine/GameMap";
import { StaticMapLight } from "../../../context/GameStateContext";
import { Light } from "../../../engine/LightFactory";

export interface AddLightReducerAction {
  type: "addLight";
  entity: StaticMapLight;
}

export function addLight(state: GameMap, action: AddLightReducerAction): GameMap {
  const light = new Light(action.entity);

  state.lights.push(light);

  return {
    ...state,
    ...{
      selectedLight: light,
    },
  };
}
