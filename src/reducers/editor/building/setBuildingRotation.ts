import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";

export interface SetBuildingRotationReducerAction {
  type: "setBuildingRotation";
  entityId: string;
  rotation: AngleInDegrees;
}

export function setBuildingRotation(state: GameMap, action: SetBuildingRotationReducerAction): GameMap {
  const entity = state.getBuildingById(action.entityId);

  if (entity) {
    state.setGridMatrixOccupancy([entity], -1);
    entity.setRotation({
      deg: action.rotation,
      rad: degToRad(action.rotation),
    });
    state.setGridMatrixOccupancy([entity], 1);

    return { ...state };
  }

  return state;
}
