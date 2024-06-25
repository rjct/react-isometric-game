import { AmmoDetailsList } from "@src/components/_modals/inventory/_shared/AmmoDetailsList";
import { ItemImage } from "@src/components/_modals/inventory/_shared/ItemImage";
import { WeaponDetailsList } from "@src/components/_modals/inventory/_shared/WeaponDetailsList";
import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import React from "react";

type InventoryItemInfoProps = { dictEntity: WeaponDictEntity | AmmoDictEntity | null };

const ItemInfoComponent = (dictEntity: InventoryItemInfoProps["dictEntity"]) => {
  switch (dictEntity?.class) {
    case "melee":
    case "firearm":
    case "throwable":
      return <WeaponDetailsList dictEntity={dictEntity} />;

    case "firearm_ammo":
    case "laser_ammo":
    case "melee_ammo":
    case "grenade_ammo":
      return <AmmoDetailsList dictEntity={dictEntity} />;

    default:
      return "---";
  }
};

export const InventoryItemInfoPanel = React.memo((props: InventoryItemInfoProps) => {
  return (
    <fieldset className={"inventory-item-info-wrapper"}>
      <legend className={"outlined"}>Info</legend>

      <div className={"inventory-item-info"}>
        {props.dictEntity ? (
          <>
            <div className={"inventory-item-title"}>{props.dictEntity.title}</div>
            <ItemImage dictEntity={props.dictEntity} />
            <div className={"inventory-item-description"}>{props.dictEntity.description}</div>
            {ItemInfoComponent(props.dictEntity)}
          </>
        ) : (
          <NothingSelectedText />
        )}
      </div>
    </fieldset>
  );
});
