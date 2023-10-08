import { AmmoDetails } from "@src/components/_modals/inventory/AmmoDetails";
import { ItemImage } from "@src/components/_modals/inventory/ItemImage";
import { WeaponDetails } from "@src/components/_modals/inventory/WeaponDetails";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import React from "react";

type InventoryItemInfoProps = { item: Weapon | Ammo | null };

const ItemInfoComponent = (item: InventoryItemInfoProps["item"]) => {
  //console.log(item?.constructor.name);
  switch (item?.class) {
    case "weapon":
      return <WeaponDetails item={item} />;

    case "firearm_ammo":
      return <AmmoDetails item={item} />;

    default:
      return "---";
  }
};

export const InventoryItemInfo = React.memo((props: InventoryItemInfoProps) => {
  return (
    <fieldset className={"inventory-item-info-wrapper"}>
      <legend className={"outlined"}>Info</legend>

      <div className={"inventory-item-info"}>
        {props.item ? (
          <>
            <div className={"inventory-item-title"}>{props.item.dictEntity.title}</div>
            <ItemImage item={props.item} />
            <div className={"inventory-item-description"}>{props.item.dictEntity.description}</div>
            {ItemInfoComponent(props.item)}
          </>
        ) : null}
      </div>
    </fieldset>
  );
});
