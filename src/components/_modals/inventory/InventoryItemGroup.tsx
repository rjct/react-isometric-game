import { InventoryItem } from "@src/components/_modals/inventory/InventoryItem";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import React from "react";

export const InventoryItemGroup = React.memo(function InventoryItemGroup(props: {
  entitiesGroup: Array<Weapon | Ammo>;
  draggable: boolean;
  editable?: boolean;
}) {
  return <InventoryItem item={props.entitiesGroup[0]} groupLength={props.entitiesGroup.length} {...props} />;
});
