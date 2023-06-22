import React from "react";
import { Unit } from "../../engine/UnitFactory";
import { Weapon } from "../../engine/weapon/WeaponFactory";
import { Firearm } from "../../engine/weapon/firearm/FirearmFactory";

export const HeroActionControl = React.memo(function HeroActionControl(props: {
  action: Unit["currentSelectedAction"];
  selected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  weapon?: Weapon;
  title?: string;
  text?: React.ReactElement;
}) {
  const weaponTitle = () => {
    if (!props.weapon) return "";

    return props.weapon.title;
  };

  const WeaponAmmoInfo = () => {
    if (!props.weapon) return "";

    if (props.weapon instanceof Firearm) {
      return `(${props.weapon.ammoCurrent.length}/${props.weapon.ammoCapacity})`;
    }

    return "";
  };

  return (
    <label className="current-hero-action" htmlFor={props.action} title={props.title}>
      <input
        type={"radio"}
        name={"user_action"}
        id={props.action}
        value={props.action}
        checked={props.selected}
        disabled={props.selected}
        onChange={props.onChange}
      />

      <div className={"label"}>
        {props.weapon ? (
          <>
            <div className={"weapon-title"}>
              {weaponTitle()} {WeaponAmmoInfo()}
            </div>
            <div className={`weapon-pic ${props.weapon.className}`}></div>
          </>
        ) : null}

        {props.text ? <span>{props.text}</span> : null}
      </div>
    </label>
  );
});
