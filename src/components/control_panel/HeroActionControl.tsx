import React from "react";
import { Unit } from "../../engine/UnitFactory";
import { Firearm } from "../../engine/weapon/FirearmFactory";

export function HeroActionControl(props: {
  action: Unit["currentSelectedAction"];
  selected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  weapon?: Firearm;
  title?: string;
  text?: React.ReactElement;
}) {
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
              {props.weapon.title} ({props.weapon.ammoCurrent.length}/{props.weapon.ammoCapacity})
            </div>
            <div className={`weapon-pic ${props.weapon.className}`}></div>
            <div className={"weapon-ap-consumption"}>AP 3</div>
          </>
        ) : null}

        {props.text ? <span>{props.text}</span> : null}
      </div>
    </label>
  );
}
