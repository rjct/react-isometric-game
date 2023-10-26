import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";

export interface SetUnitRotationReducerAction {
  type: "setUnitRotation";
  entityId: string;
  rotation: AngleInDegrees;
}

export function setUnitRotation(state: GameMap, action: SetUnitRotationReducerAction): GameMap {
  const entity = state.getUnitById(action.entityId);

  if (entity) {
    entity.setRotation({
      deg: action.rotation,
      rad: degToRad(action.rotation),
    });

    return { ...state };
  }

  return state;
}
