import { Unit } from "../engine/UnitFactory";
import { Firearm } from "../engine/weapon/FirearmFactory";
import { GameMap } from "../engine/GameMap";

export type TransferItemReducerAction = {
  type: "transferItem";
  item: Firearm;
  from: { unit: Unit; inventoryType: keyof Unit["inventory"] };
  to: { unit: Unit; inventoryType: keyof Unit["inventory"] };
};

export function transferItem(state: GameMap, action: TransferItemReducerAction): GameMap {
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
