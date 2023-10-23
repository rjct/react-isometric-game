import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import React from "react";

const correctValuePrefix = (value: number) => {
  return `${value < 0 ? "-" : "+"}${Math.abs(value)}`;
};

export const AmmoDetailsList = React.memo((props: { dictEntity: AmmoDictEntity }) => {
  return (
    <ul>
      <li>
        <div className={"prop"}>Weight:</div>
        <div className={"value"}>{props.dictEntity.weight}</div>
      </li>
      <li>
        <div className={"prop"}>Price:</div>
        <div className={"value"}>${props.dictEntity.price}</div>
      </li>
      <li>
        <div className={"prop"}>Damage:</div>
        <div className={"value"}>{correctValuePrefix(props.dictEntity.damage)}%</div>
      </li>
      <li>
        <div className={"prop"}>Penetration:</div>
        <div className={"value"}>{correctValuePrefix(props.dictEntity.penetration)}%</div>
      </li>
    </ul>
  );
});
