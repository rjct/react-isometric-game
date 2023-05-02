import { GameMap } from "../engine/GameMap";

export interface SetEntityVariantReducerAction {
  type: "setEntityVariant";
  entityId: string;
  variant: number;
}

export function setEntityVariant(state: GameMap, action: SetEntityVariantReducerAction): GameMap {
  const entity = state.getEntityById(action.entityId);

  if (entity) {
    entity.setVariant(action.variant);

    return { ...state };
  }

  return state;
}
