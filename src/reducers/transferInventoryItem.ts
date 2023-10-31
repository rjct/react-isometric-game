import { Building } from "@src/engine/building/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export type TransferInventoryItemReducerAction = {
  type: "transferInventoryItem";
  item: Weapon | Ammo;
  to: { unit: Unit | Building | Vehicle; inventoryType: keyof Unit["inventory"] };
};

export function transferInventoryItem(state: GameMap, action: TransferInventoryItemReducerAction): GameMap {
  const item = action.item;
  const to = action.to;

  if (item.owner) {
    if (item instanceof Firearm) {
      item.unload();
    }

    item.owner.removeItemFromInventory(item, item.owner.findInventoryEntityPlaceType(item)!);
  }

  item.assignOwner(to.unit);

  to.unit.putItemToInventory(item, to.inventoryType);

  return { ...state };
}
