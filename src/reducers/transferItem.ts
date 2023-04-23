import { GameMap } from "../engine/GameMap";
import { Unit } from "../engine/UnitFactory";
import { Weapon } from "../engine/WeaponFactory";

export type TransferItemReducerAction = {
  type: "transferItem";
  item: Weapon;
  from: { unit: Unit; inventoryType: keyof Unit["inventory"] };
  to: { unit: Unit; inventoryType: keyof Unit["inventory"] };
};

export function transferItem(state: typeof GameMap, action: TransferItemReducerAction): typeof GameMap {
  const item = action.item;
  const from = action.from;
  const to = action.to;

  item.assignUnit(to.unit);

  from.unit.removeItemFromInventory(item, from.inventoryType);
  to.unit.putItemToInventory(item, to.inventoryType);

  return {
    ...state,
  };
}
