import { GameMap } from "@src/engine/gameMap";

export interface SetBuildingVariantReducerAction {
  type: "setBuildingVariant";
  entityId: string;
  variant: number;
}

export function setBuildingVariant(state: GameMap, action: SetBuildingVariantReducerAction): GameMap {
  const entity = state.getBuildingById(action.entityId);

  if (entity) {
    entity.setVariant(action.variant);

    return { ...state };
  }

  return state;
}
