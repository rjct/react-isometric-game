import { InventoryDetailsRow } from "@src/components/_modals/inventory/_shared/InventoryDetailsRow";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import React from "react";

const correctValuePrefix = (value: number) => {
  return `${value < 0 ? "-" : "+"}${Math.abs(value)}`;
};

export const AmmoDetailsList = React.memo((props: { dictEntity: AmmoDictEntity }) => {
  return (
    <ul>
      <InventoryDetailsRow label={"Weight"}>{props.dictEntity.weight}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Price"}>${props.dictEntity.price}</InventoryDetailsRow>
      <InventoryDetailsRow label={"Damage"}>{correctValuePrefix(props.dictEntity.damage)}%</InventoryDetailsRow>
      <InventoryDetailsRow label={"Penetration"}>
        {correctValuePrefix(props.dictEntity.penetration)}%
      </InventoryDetailsRow>
    </ul>
  );
});
