import { faRefresh } from "@fortawesome/free-solid-svg-icons/faRefresh";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { MeleeWeapon } from "@src/engine/weapon/melee/MeleeWeaponFactory";
import { ThrowableWeapon } from "@src/engine/weapon/throwable/ThrowableWeaponFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const HeroActionControl = (props: {
  action: Unit["currentSelectedAction"];
  selected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  weapon?: Firearm | ThrowableWeapon | MeleeWeapon;
  title?: string;
  text?: React.ReactElement;
}) => {
  const { gameState } = useGameState();
  const { hero } = useHero();

  const weaponTitle = () => {
    if (!props.weapon) return "";

    return props.weapon.dictEntity.title;
  };

  const WeaponAmmoInfo = () => {
    if (!props.weapon) return "";

    if (props.weapon instanceof Firearm) {
      return `(${props.weapon.ammoCurrent.length}/${props.weapon.dictEntity.ammoCapacity})`;
    }

    return "";
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hero.currentSelectedAction !== props.action) return;

    const weapon = props.weapon;

    if (!weapon) return;

    const weaponAttackModes = weapon.getAttackModes();
    const weaponAttackModeIndex = weaponAttackModes.findIndex((attackMode) => attackMode === weapon.currentAttackMode);
    const nextIndex = weaponAttackModeIndex + 1 > weaponAttackModes.length - 1 ? 0 : weaponAttackModeIndex + 1;

    weapon.setAttackMode(weaponAttackModes[nextIndex]);

    e.stopPropagation();
  };

  const handleReloadWeaponButtonClick = (e: React.MouseEvent) => {
    const weapon = props.weapon;

    if (weapon instanceof Firearm && weapon.ammoCurrent.length === 0) {
      e.stopPropagation();
      weapon.reload(gameState);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
  };

  return (
    <>
      <label className="current-hero-action" htmlFor={props.action} title={props.title} onClick={handleClick}>
        <input
          type={"radio"}
          name={"user_action"}
          id={props.action}
          value={props.action}
          checked={props.selected}
          disabled={props.selected}
          onChange={handleChange}
        />

        <div className={"label"}>
          {props.weapon ? (
            <>
              <div className={"weapon-title"}>
                {weaponTitle()} {WeaponAmmoInfo()}
              </div>
              <div className={`inventory-item-pic ${props.weapon.name}`} data-name={props.weapon.name}></div>
              <div className={"weapon-ap-consumption"}>
                Mode: {props.weapon.currentAttackMode} / AP:{" "}
                {props.weapon.getCurrentAttackModeDetails().actionPointsConsumption}
              </div>
            </>
          ) : null}

          {props.text ? <span>{props.text}</span> : null}
        </div>

        {props.weapon instanceof Firearm && props.weapon.ammoCurrent.length === 0 ? (
          <div className={"weapon-reload-button"} title={"Reload weapon"} onClick={handleReloadWeaponButtonClick}>
            <FontAwesomeIcon icon={faRefresh} size={"3x"} />
          </div>
        ) : null}
      </label>
    </>
  );
};
