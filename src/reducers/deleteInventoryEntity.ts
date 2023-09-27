import { GameMap } from "@src/engine/gameMap";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type DeleteInventoryEntityReducerAction = {
  type: "deleteInventoryEntity";
  entity: Weapon;
};

export function deleteInventoryEntity(state: GameMap, action: DeleteInventoryEntityReducerAction): GameMap {
  state.deleteInventoryEntity(action.entity);

  return { ...state };
}
