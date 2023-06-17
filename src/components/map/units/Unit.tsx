import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { getEntityZIndex } from "../../../engine/helpers";
import { Ammo } from "../weapons/Ammo";
import { useGameState } from "../../../hooks/useGameState";
import { Firearm } from "../../../engine/weapon/firearm/FirearmFactory";
import { Fade } from "../../Fade";
import { UnitCooldownTimer } from "./UnitCooldownTimer";
import { UnitHealth } from "./UnitHealth";
import { UnitDamagePoints } from "./UnitDamagePoints";

export const UnitComponent = React.memo(function UnitComponent(props: { unit: Unit }) {
  const { gameState, uiState } = useGameState();

  const [zIndex, setZIndex] = React.useState(0);
  const [screenPosition, setScreenPosition] = React.useState({ x: 0, y: 0 });

  const renderAmmo = () => {
    const weapon = props.unit.getCurrentWeapon();

    if (weapon && weapon instanceof Firearm) {
      return <Ammo weapon={weapon}></Ammo>;
    }

    return null;
  };

  React.useEffect(() => {
    if (gameState.settings.featureEnabled.unitShadow) {
      props.unit.calcShadows(gameState);
    } else {
      props.unit.clearShadows();
    }

    setZIndex(getEntityZIndex(props.unit));
    setScreenPosition(gameState.gridToScreenSpace(props.unit.position));
  }, [
    uiState.scene === "editor" ? gameState.getLightsHash() : false,
    gameState.getAllAliveUnitsHash(),
    gameState.settings.featureEnabled.unitShadow,
  ]);

  return (gameState.isEntityInViewport(props.unit, uiState.viewport) && uiState.scene === "editor") ||
    gameState.isEntityVisible(props.unit) ? (
    <>
      {renderAmmo()}
      {props.unit.shadows.map((shadow, index) => {
        {
          return (
            <Fade key={index} show={!shadow.blocked || shadow.opacity <= 0}>
              <div
                data-direction={props.unit.direction}
                data-action={props.unit.action}
                data-weapon={props.unit.getCurrentWeapon()?.className}
                className={`${props.unit.className} unit-shadow`}
                style={{
                  transform: [
                    `translate(${screenPosition.x}px, ${screenPosition.y}px)`,
                    `rotateX(60deg)`,
                    `rotateZ(${shadow.angle}deg)`,
                    `scaleY(${shadow.width})`,
                  ].join(""),
                  zIndex: zIndex,
                  opacity: shadow.opacity,
                }}
              >
                <div className="char"></div>
              </div>
            </Fade>
          );
        }
      })}
      <div
        data-direction={props.unit.direction}
        data-action={props.unit.action}
        data-weapon={props.unit.getCurrentWeapon()?.className}
        className={props.unit.className}
        style={{
          transform: `translate(${screenPosition.x}px, ${screenPosition.y}px)`,
          zIndex: zIndex,
        }}
      >
        <div className="char"></div>
        <UnitDamagePoints unit={props.unit} />
        <UnitCooldownTimer unit={props.unit} />
        <UnitHealth unit={props.unit} />
      </div>
    </>
  ) : null;
});
