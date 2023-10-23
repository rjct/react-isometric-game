import { Ammo } from "@src/engine/weapon/AmmoFactory";
import React from "react";

const correctValuePrefix = (value: number) => {
  return `${value < 0 ? "-" : "+"}${Math.abs(value)}`;
};

export const AmmoDetailsList = React.memo((props: { item: Ammo }) => {
  return (
    <ul>
      <li>
        <div className={"prop"}>Weight:</div>
        <div className={"value"}>{props.item.dictEntity.weight}</div>
      </li>
      <li>
        <div className={"prop"}>Price:</div>
        <div className={"value"}>${props.item.dictEntity.price}</div>
      </li>
      <li>
        <div className={"prop"}>Damage:</div>
        <div className={"value"}>{correctValuePrefix(props.item.dictEntity.damage)}%</div>
      </li>
      <li>
        <div className={"prop"}>Penetration:</div>
        <div className={"value"}>{correctValuePrefix(props.item.dictEntity.penetration)}%</div>
      </li>
    </ul>
  );
});
