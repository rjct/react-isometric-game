import { WeaponAttackMode, WeaponDictEntity } from "@src/dict/weapon/weapon";
import React from "react";

export const WeaponDetailsList = React.memo((props: { dictEntity: WeaponDictEntity }) => {
  const range = {
    min: Infinity,
    max: -Infinity,
  };

  const damage = {
    min: Infinity,
    max: -Infinity,
  };

  const attachModes = Object.keys(props.dictEntity.attackModes) as WeaponAttackMode[];

  attachModes.forEach((attackMode) => {
    range.min = Math.min(range.min, props.dictEntity.attackModes[attackMode]?.range || 0);
    range.max = Math.max(range.max, props.dictEntity.attackModes[attackMode]?.range || 0);

    damage.min = Math.min(damage.min, props.dictEntity.attackModes[attackMode]?.damage.min || 0);
    damage.max = Math.max(damage.max, props.dictEntity.attackModes[attackMode]?.damage.max || 0);
  });

  return (
    <>
      <ul>
        <li>
          <div className={"prop"}>Weight:</div>
          <div className={"value"}>{props.dictEntity.weight}</div>
        </li>
        <li>
          <div className={"prop"}>Ammo:</div>
          <div className={"value"}>
            {attachModes.map((attackMode) => props.dictEntity.attackModes[attackMode]?.ammoType).join(", ")}
          </div>
        </li>
        <li>
          <div className={"prop"}>Magazine size:</div> <div className={"value"}>{props.dictEntity.ammoCapacity}</div>
        </li>
        <li>
          <div className={"prop"}>Price:</div>
          <div className={"value"}>${props.dictEntity.price}</div>
        </li>
        <li>
          <div className={"prop"}>Range:</div>
          <div className={"value"}>{range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`}</div>
        </li>
        <li>
          <div className={"prop"}>Damage:</div>
          <div className={"value"}>{damage.min === damage.max ? `${damage.min}` : `${damage.min}-${damage.max}`}</div>
        </li>
      </ul>
    </>
  );
});
