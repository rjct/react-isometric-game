import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";
import { Light } from "@src/engine/light/LightFactory";

export interface SetEntityPositionReducerAction {
  type: "setEntityPosition";
  entity: GameEntity | Light;
  coordinates: GridCoordinates;
}

export function setEntityPosition(state: GameMap, action: SetEntityPositionReducerAction): GameMap {
  const entity = action.entity;

  if (entity) {
    if (!(entity instanceof Light)) state.setGridMatrixOccupancy([entity], -1);

    entity.setPosition(action.coordinates, state);

    if (!(entity instanceof Light)) state.setGridMatrixOccupancy([entity], 1);

    return { ...state };
  }

  return state;
}
