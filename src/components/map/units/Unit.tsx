import React from "react";
import { Unit } from "../../../engine/UnitFactory";
import { Ammo } from "../weapons/Ammo";
import { useGameState } from "../../../hooks/useGameState";
import { Firearm } from "../../../engine/weapon/firearm/FirearmFactory";
import { UnitCooldownTimer } from "./UnitCooldownTimer";
import { UnitHealth } from "./UnitHealth";
import { UnitDamagePoints } from "./UnitDamagePoints";
import { UnitShadow } from "./UnitShadow";
import { UnitEnemyInViewMark } from "./UnitEnemyInViewMark";

export const UnitComponent = React.memo(function UnitComponent(props: {
  unit: Unit;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Unit) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) {
  const { gameState, uiState } = useGameState();

  const isUnitVisible =
    gameState.isEntityVisible(props.unit) && gameState.isEntityInViewport(props.unit, uiState.viewport);

  const renderAmmo = () => {
    const weapon = props.unit.getCurrentWeapon();

    if (weapon && weapon instanceof Firearm) {
      return <Ammo weapon={weapon}></Ammo>;
    }

    return null;
  };

  React.useEffect(() => {
    if (!isUnitVisible) return;

    props.unit.calcShadows(gameState);
  }, [
    props.unit.isDead,
    gameState.settings.featureEnabled.unitShadow ? props.unit.getHash() : false,
    gameState.settings.featureEnabled.unitShadow,
  ]);

  return isUnitVisible ? (
    <>
      {renderAmmo()}

      <div
        data-direction={props.unit.direction}
        data-action={props.unit.action}
        data-weapon={props.unit.getCurrentWeapon()?.className}
        data-at-gunpoint={!props.unit.isDead && props.unit.atGunpoint}
        data-selected={props.selected || null}
        data-dragging={props.dragging || null}
        onMouseDown={(e: React.MouseEvent) => {
          if (props.onMouseDown) {
            props.onMouseDown(e, props.unit);
          }
        }}
        onMouseUp={props.onMouseUp}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={props.unit.className}
        style={{
          transform: `translate(${props.unit.screenPosition.x}px, ${props.unit.screenPosition.y}px)`,
          zIndex: props.unit.zIndex,
        }}
      >
        <div className="char"></div>
        <UnitEnemyInViewMark unit={props.unit} />
        <UnitDamagePoints unit={props.unit} />
        <UnitCooldownTimer unit={props.unit} />
        <UnitHealth unit={props.unit} />
        <UnitShadow shadows={props.unit.shadows} />
      </div>
    </>
  ) : null;
});
