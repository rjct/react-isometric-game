import { faRefresh } from "@fortawesome/free-solid-svg-icons/faRefresh";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { weaponAttackModes } from "@src/dict/weapon/weapon";
import { constants } from "@src/engine/constants";
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

  const [attackMode, setAttackMode] = React.useState({
    index: 0,
    mode: props.weapon?.currentAttackMode,
  });

  const [ammoCurrent, setAmmoCurrent] = React.useState(0);

  const currentWeaponAttackModes = React.useMemo(() => {
    return props.weapon ? props.weapon.getAttackModes() : [];
  }, [props.weapon]);

  React.useEffect(() => {
    if (props.weapon && props.weapon instanceof Firearm) {
      setAmmoCurrent(props.weapon.ammoCurrent.length);
    }
  }, [(props.weapon as Firearm)?.ammoCurrent?.length]);

  const WeaponAmmoInfo = () => {
    if (!props.weapon) return "";

    if (props.weapon instanceof Firearm) {
      return (
        <div className={"weapon-ammo-wrapper"}>
          <div className={"weapon-ammo"}>
            {[...Array(props.weapon.dictEntity.ammoCapacity)].fill(1, ammoCurrent).map((value, index) => {
              return <div key={index} data-empty={value}></div>;
            })}
          </div>
          <div className={"weapon-ammo-count"}>{ammoCurrent}</div>
        </div>
      );
    }

    return "";
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hero.currentSelectedAction !== props.action) return;

    const weapon = props.weapon;

    if (!weapon) return;

    const weaponAttackModeIndex = currentWeaponAttackModes.findIndex(
      (attackMode) => attackMode === weapon.currentAttackMode,
    );
    const nextIndex = weaponAttackModeIndex + 1 > currentWeaponAttackModes.length - 1 ? 0 : weaponAttackModeIndex + 1;

    weapon.setAttackMode(currentWeaponAttackModes[nextIndex]);
    setAttackMode({
      index: weaponAttackModeIndex,
      mode: currentWeaponAttackModes[nextIndex],
    });
    gameState.playSfx([constants.sfx.ui.switch]);

    e.stopPropagation();
  };

  const handleReloadWeaponButtonClick = (e: React.MouseEvent) => {
    const weapon = props.weapon;

    if (weapon instanceof Firearm && ammoCurrent < weapon.getCurrentAttackModeDetails().ammoConsumption) {
      e.stopPropagation();
      weapon.reload(gameState);
      setAmmoCurrent(weapon.ammoCurrent.length);
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
          {props.weapon && attackMode.mode ? (
            <>
              <div className={`inventory-item-pic ${props.weapon.name}`} data-name={props.weapon.name}></div>
              <div className={"weapon-ap-consumption"}>
                AP: {props.weapon.getCurrentAttackModeDetails().actionPointsConsumption}
              </div>

              {currentWeaponAttackModes.length > 1 ? (
                <div className={"weapon-attack-mode-indicator"}>
                  {currentWeaponAttackModes.map((mode, index) => {
                    return <div key={mode} data-selected={index == attackMode.index}></div>;
                  })}
                </div>
              ) : null}

              <div className={"weapon-attack-mode"}>{weaponAttackModes[attackMode.mode]}</div>
            </>
          ) : null}

          {props.text ? <span>{props.text}</span> : null}
        </div>

        {WeaponAmmoInfo()}

        {props.weapon instanceof Firearm && ammoCurrent < props.weapon.getCurrentAttackModeDetails().ammoConsumption ? (
          <div className={"weapon-reload-button"} title={"Reload weapon"} onClick={handleReloadWeaponButtonClick}>
            <FontAwesomeIcon icon={faRefresh} size={"3x"} />
          </div>
        ) : null}
      </label>
    </>
  );
};
