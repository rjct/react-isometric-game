import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type TransferInventoryEntityReducerAction = {
  type: "transferInventoryEntity";
  entity: Weapon;
  to: { unit: Unit | Building; inventoryType: keyof Unit["inventory"] };
};

export function transferInventoryEntity(state: GameMap, action: TransferInventoryEntityReducerAction): GameMap {
  const entity = action.entity;
  const to = action.to;

  if (entity.owner) {
    entity.owner.removeItemFromInventory(entity, entity.owner.findInventoryEntityPlaceType(entity)!);
  }

  entity.assignOwner(to.unit);

  to.unit.putItemToInventory(entity, to.inventoryType);

  return { ...state };
}
