import { StaticMapLight } from "@src/context/GameStateContext";
import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";

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
