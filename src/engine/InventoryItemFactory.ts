import { AmmoName } from "@src/dict/ammo/ammo";
import { WeaponName } from "@src/dict/weapon/weapon";
import { Building } from "@src/engine/building/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";

export enum inventoryItemClasses {
  weapon = "Weapon",
  ammo = "Ammo",
}
export type InventoryItemClass = keyof typeof inventoryItemClasses;
export type InventoryItemClassGroupName = WeaponName | AmmoName;
export type InventoryItemGroup = {
  count: number;
  items: { [p: WeaponName | AmmoName]: Array<Weapon | Ammo> };
};
export interface InventoryItemClassGroup {
  [p: InventoryItemClassGroupName]: InventoryItemGroup;
}

export enum inventoryItemSortingProps {
  title = "Title",
  weight = "Weight",
  price = "Price",
}
export type InventoryItemSortingProp = keyof typeof inventoryItemSortingProps;

export class InventoryItem {
  public readonly itemClass: InventoryItemClass;
  public owner: Unit | Building | Vehicle | null = null;
  constructor(itemClass: InventoryItemClass) {
    this.itemClass = itemClass;
  }

  assignOwner(owner: Unit | Building | Vehicle) {
    this.owner = owner;
  }

  unAssignOwner() {
    this.owner = null;
  }
}
