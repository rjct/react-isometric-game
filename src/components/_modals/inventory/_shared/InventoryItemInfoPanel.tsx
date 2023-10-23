import { AmmoDetailsList } from "@src/components/_modals/inventory/_shared/AmmoDetailsList";
import { ItemImage } from "@src/components/_modals/inventory/_shared/ItemImage";
import { WeaponDetailsList } from "@src/components/_modals/inventory/_shared/WeaponDetailsList";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import React from "react";

type InventoryItemInfoProps = { item: Weapon | Ammo | null };

const ItemInfoComponent = (item: InventoryItemInfoProps["item"]) => {
  switch (item?.class) {
    case "weapon":
      return <WeaponDetailsList item={item} />;

    case "firearm_ammo":
      return <AmmoDetailsList item={item} />;

    default:
      return "---";
  }
};

export const InventoryItemInfoPanel = React.memo((props: InventoryItemInfoProps) => {
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
