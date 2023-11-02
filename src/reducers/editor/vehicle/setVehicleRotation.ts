import { GameMap } from "@src/engine/gameMap";
import { degToRad } from "@src/engine/helpers";

export interface SetVehicleRotationReducerAction {
  type: "setVehicleRotation";
  entityId: string;
  rotation: AngleInDegrees;
}

export function setVehicleRotation(state: GameMap, action: SetVehicleRotationReducerAction): GameMap {
  const entity = state.getVehicleById(action.entityId);

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
