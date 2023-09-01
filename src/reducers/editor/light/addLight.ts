import { StaticMapLight } from "@src/context/GameStateContext";
import { GameMap } from "@src/engine/GameMap";
import { Light } from "@src/engine/LightFactory";

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
