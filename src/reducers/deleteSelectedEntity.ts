import { GameMap } from "../engine/GameMap";
import { Building } from "../engine/BuildingFactory";

export interface DeleteSelectedEntityReducerAction {
  type: "deleteSelectedEntity";
  entityId: string;
}

export function deleteSelectedEntity(state: GameMap, action: DeleteSelectedEntityReducerAction): GameMap {
  const confirmDelete = confirm(`Are you sure to delete "${action.entityId}"?`);

  if (!confirmDelete) return state;

  state.selectedEntity = null as unknown as Building;
  state.deleteEntity(action.entityId);

  return { ...state };
}
