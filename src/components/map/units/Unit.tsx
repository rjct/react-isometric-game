import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { getUnitZIndex } from "../../../engine/helpers";
import { Ammo } from "../weapons/Ammo";
import { useGameState } from "../../../hooks/useGameState";

export function UnitComponent(props: { unit: Unit; direction?: Unit["direction"]; action?: Unit["action"] }) {
  const { gameState, uiState } = useGameState();

  const selected = props.unit.id === gameState.heroId;

  const [zIndex, setZIndex] = React.useState(0);
  const [screenPosition, setScreenPosition] = React.useState({ x: 0, y: 0 });

  const atGunpoint = () => {
    return gameState.wireframe[Math.round(props.unit.position.y)][Math.round(props.unit.position.x)].style === "target";
  };

  React.useEffect(() => {
    setZIndex(getUnitZIndex(props.unit));
    setScreenPosition(gameState.gridToScreenSpace(props.unit.position));
  }, [JSON.stringify(props.unit.position)]);

  return gameState.isEntityInViewport(props.unit, uiState.viewport) && gameState.isEntityVisible(props.unit) ? (
    <>
      <Ammo unit={props.unit}></Ammo>
      <div
        data-direction={props.direction || props.unit.direction}
        data-action={props.action || props.unit.action}
        data-weapon={props.unit.getCurrentWeapon()?.className}
        data-at-gunpoint={atGunpoint() && !props.unit.isDead ? true : null}
        className={`${props.unit.className}`}
        style={{
          transform: `translate(${screenPosition.x}px, ${screenPosition.y}px)`,
          zIndex: zIndex,
        }}
      >
        <div className="char"></div>
        {selected ? <div className="sel"></div> : null}
        {gameState.debug && !props.unit.isDead ? (
          <div className={"health"}>
            <div style={{ width: `${(props.unit.healthPoints.current * 100) / props.unit.healthPoints.max}%` }}></div>
          </div>
        ) : null}
      </div>
    </>
  ) : null;
}
