import { UnitActionPoints } from "@src/components/map/units/UnitActionPoints";
import { UnitCooldownTimer } from "@src/components/map/units/UnitCooldownTimer";
import { UnitDamagePoints } from "@src/components/map/units/UnitDamagePoints";
import { UnitEnemyInViewMark } from "@src/components/map/units/UnitEnemyInViewMark";
import { UnitHealth } from "@src/components/map/units/UnitHealth";
import { UnitShadowComponent } from "@src/components/map/units/UnitShadow";
import { getCss3dPosition } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const UnitComponent = React.memo(function UnitComponent(props: {
  unit: Unit;
  selected?: boolean;
  dragging?: boolean;
  isInHeroView?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Unit) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}) {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();

  const isEditing = checkCurrentScene(["editor"]);
  const isUnitVisible =
    !props.unit.isVehicleInUse() &&
    (isEditing ||
      (gameState.isEntityVisibleByHero(props.unit) && gameState.isEntityInViewport(props.unit, uiState.viewport)));

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
    <div
      data-rotation={props.unit.rotation.deg}
      data-action={props.unit.action}
      data-weapon={props.unit.getCurrentWeapon()?.dictEntity.type}
      data-selected-for-inventory-transfer={
        gameState.highlightedEntityForInventoryTransfer?.id === props.unit.id ||
        gameState.selectedEntityForInventoryTransfer?.id === props.unit.id ||
        null
      }
      data-at-gunpoint={(!props.unit.isDead && props.unit.atGunpoint) || null}
      data-highlighed={
        (!props.unit.isDead &&
          uiState.scene === "combat" &&
          !!gameState.combatQueue.units.find((unit) => unit.id === props.unit.id)) ||
        null
      }
      data-in-hero-view={props.isInHeroView}
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
        transform: getCss3dPosition(props.unit.position.screen, false),
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
  );
});
