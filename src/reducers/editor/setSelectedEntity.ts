import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";

export interface SetSelectedEntityReducerAction {
  type: "setSelectedEntity";
  entity: GameEntity | Light;
}

export function setSelectedEntity(state: GameMap, action: SetSelectedEntityReducerAction) {
  return { ...state, ...{ selectedEntity: action.entity } };
}
