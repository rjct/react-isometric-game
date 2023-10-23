import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { GameMap } from "@src/engine/gameMap";

export type SetSelectedInventoryItemReducerAction = {
  type: "setSelectedInventoryItem";
  item: WeaponDictEntity | AmmoDictEntity | null;
};

export function setSelectedInventoryItem(state: GameMap, action: SetSelectedInventoryItemReducerAction): GameMap {
  return {
    ...state,
    ...{ selectedInventoryItem: action.item },
  };
}
