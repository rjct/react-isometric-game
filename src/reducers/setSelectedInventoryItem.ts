import { GameMap } from "@src/engine/gameMap";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type SetSelectedInventoryItemReducerAction = {
  type: "setSelectedInventoryItem";
  item: Weapon | Ammo | null;
};

export function setSelectedInventoryItem(state: GameMap, action: SetSelectedInventoryItemReducerAction): GameMap {
  return {
    ...state,
    ...{ selectedInventoryItem: action.item },
  };
}
