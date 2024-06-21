import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";

export interface ClearSelectedEntityReducerAction {
  type: "clearSelectedEntity";
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function clearSelectedEntity(state: GameMap, action: ClearSelectedEntityReducerAction): GameMap {
  return { ...state, ...{ selectedEntity: null as unknown as GameEntity } };
}
