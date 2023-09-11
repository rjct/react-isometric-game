import { UnitActionPoints } from "@src/components/map/units/UnitActionPoints";
import { UnitCooldownTimer } from "@src/components/map/units/UnitCooldownTimer";
import { UnitDamagePoints } from "@src/components/map/units/UnitDamagePoints";
import { UnitEnemyInViewMark } from "@src/components/map/units/UnitEnemyInViewMark";
import { UnitHealth } from "@src/components/map/units/UnitHealth";
import { UnitShadowComponent } from "@src/components/map/units/UnitShadow";
import { Ammo } from "@src/components/map/weapons/Ammo";
import { Unit } from "@src/engine/UnitFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

const renderAmmo = (unit: Unit) => {
  const weapon = unit.getCurrentWeapon();

  if (weapon && weapon instanceof Firearm) {
    return <Ammo weapon={weapon}></Ammo>;
  }

  return null;
};

export const UnitComponent = React.memo(function UnitComponent(props: {
  unit: Unit;
  selected?: boolean;
  dragging?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Unit) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();

  const isEditing = checkCurrentScene(["editor"]);
  const isUnitVisible =
    isEditing || (gameState.isEntityVisible(props.unit) && gameState.isEntityInViewport(props.unit, uiState.viewport));

  React.useEffect(() => {
    if (!isUnitVisible) return;

    props.unit.calcShadows(gameState);
  }, [
    props.unit.isDead,
    gameState.settings.featureEnabled.unitShadow ? props.unit.getHash() : false,
    gameState.settings.featureEnabled.unitShadow,
  ]);

  if (!isUnitVisible) return null;

  const isIsometric = gameState.debug.featureEnabled.buildingBoxes || isEditing;

  return (
    <>
      {renderAmmo(props.unit)}

      <div
        data-direction={props.unit.direction}
        data-action={props.unit.action}
        data-weapon={props.unit.getCurrentWeapon()?.className}
        data-at-gunpoint={(!props.unit.isDead && props.unit.atGunpoint) || null}
        data-highlighed={
          (!props.unit.isDead &&
            uiState.scene === "combat" &&
            !!gameState.combatQueue.units.find((unit) => unit.id === props.unit.id)) ||
          null
        }
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
          left: props.unit.screenPosition[isIsometric ? "iso" : "screen"].x,
          top: props.unit.screenPosition[isIsometric ? "iso" : "screen"].y,
          zIndex: props.unit.zIndex,
        }}
      >
        <div className="char"></div>
        <UnitEnemyInViewMark unit={props.unit} />
        <UnitDamagePoints action={props.unit.action} damagePoints={props.unit.damagePoints} />
        <UnitCooldownTimer unit={props.unit} />
        <UnitHealth unit={props.unit} />
        <UnitActionPoints unit={props.unit} />

        {props.unit.shadows.map((shadow, index) => (
          <UnitShadowComponent key={index} shadow={shadow} />
        ))}
      </div>
    </>
  );
});
