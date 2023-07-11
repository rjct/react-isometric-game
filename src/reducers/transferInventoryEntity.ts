import { Unit } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";
import { Weapon } from "../engine/weapon/WeaponFactory";

export type TransferInventoryEntityReducerAction = {
  type: "transferInventoryEntity";
  entity: Weapon;
  from: { unit: Unit; inventoryType: keyof Unit["inventory"] };
  to: { unit: Unit; inventoryType: keyof Unit["inventory"] };
};

export function transferInventoryEntity(state: GameMap, action: TransferInventoryEntityReducerAction): GameMap {
  const entity = action.entity;
  const from = action.from;
  const to = action.to;

  entity.assignUnit(to.unit);

  from.unit.removeItemFromInventory(entity, from.inventoryType);
  to.unit.putItemToInventory(entity, to.inventoryType);

  return { ...state };
}
