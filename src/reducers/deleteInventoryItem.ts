import { GameMap } from "@src/engine/gameMap";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type DeleteInventoryItemReducerAction = {
  type: "deleteInventoryItem";
  item: Weapon | Ammo;
};

export function deleteInventoryItem(state: GameMap, action: DeleteInventoryItemReducerAction): GameMap {
  state.deleteInventoryItem(action.item);

  return { ...state };
}
