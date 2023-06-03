import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { getEntityZIndex } from "../../../engine/helpers";
import { Ammo } from "../weapons/Ammo";
import { useGameState } from "../../../hooks/useGameState";
import { Firearm } from "../../../engine/weapon/firearm/FirearmFactory";

export const UnitComponent = React.memo(function UnitComponennt(props: {
  unit: Unit;
  direction?: Unit["direction"];
  action?: Unit["action"];
}) {
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
    setZIndex(getEntityZIndex(props.unit));
    setScreenPosition(gameState.gridToScreenSpace(props.unit.position));
  }, [JSON.stringify(props.unit.position)]);

  return (gameState.isEntityInViewport(props.unit, uiState.viewport) && uiState.scene === "editor") ||
    gameState.isEntityVisible(props.unit) ? (
    <>
      {renderAmmo()}
      <div
        data-direction={props.direction || props.unit.direction}
        data-action={props.action || props.unit.action}
        data-weapon={props.unit.getCurrentWeapon()?.className}
        className={props.unit.className}
        style={{
          transform: `translate(${screenPosition.x}px, ${screenPosition.y}px)`,
          zIndex: zIndex,
        }}
      >
        <div className="char"></div>
        <div className="damage-points">{props.unit.action === "hit" ? props.unit.damagePoints : ""}</div>
        {gameState.debug.enabled && !props.unit.isDead ? (
          <div className={"health"}>
            <div style={{ width: `${(props.unit.healthPoints.current * 100) / props.unit.healthPoints.max}%` }}></div>
          </div>
        ) : null}
      </div>
    </>
  ) : null;
});
