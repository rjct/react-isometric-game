import { UnitAdditionalInfo } from "@src/components/viewport/layers/userInteraction/units/additionalInfo/UnitAdditionalInfo";
import { getCss3dPosition } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";
import { normalizeRotation } from "@src/engine/weapon/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useMessages } from "@src/hooks/useMessages";
import { usePreviousValue } from "@src/hooks/usePreviousValue";
import { useScene } from "@src/hooks/useScene";
import React, { CSSProperties } from "react";

export const UnitComponent = React.memo(function UnitComponent(props: {
  unit: Unit;
  selected?: boolean;
  dragging?: boolean;
  isInHeroView?: boolean;
  onMouseDown?: (e: React.MouseEvent, entity: Unit) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent, entity: Unit) => void;
  style?: CSSProperties;
}) {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { notify_EntityTakesDamage, notify_UnitEarnedXP, notify_UnitEarnedLevel } = useMessages();

  const previousXP = usePreviousValue(props.unit.characteristics.xp);
  const previousLVL = usePreviousValue(props.unit.characteristics.level);

  const isEditing = checkCurrentScene(["editor"]);
  const isUnitVisible =
    !props.unit.isVehicleInUse() &&
    (isEditing ||
      (gameState.isEntityVisibleByHero(props.unit) && gameState.isEntityInViewport(props.unit, uiState.viewport)));

  const unitCssProps = React.useMemo((): CSSProperties => {
    return {
      transform: getCss3dPosition(props.unit.position.screen, false),
      zIndex: props.unit.zIndex,
      width: props.unit.dictEntity.size.screen.width,
      height: props.unit.dictEntity.size.screen.height,
    };
  }, [props.unit.zIndex, props.unit.position.screen]);

  React.useEffect(() => {
    if (!isUnitVisible) return;

    props.unit.calcShadows(gameState);
  }, [
    props.unit.isDead,
    gameState.settings.featureEnabled.unitShadow ? props.unit.getHash() : false,
    gameState.settings.featureEnabled.unitShadow,
  ]);

  React.useEffect(() => {
    if (props.unit.isDead) return;

    notify_EntityTakesDamage(props.unit);
  }, [props.unit.damagePoints]);

  React.useEffect(() => {
    const earnedXp = props.unit.characteristics.xp - (previousXP || 0);

    if (earnedXp <= 0) return;

    notify_UnitEarnedXP(props.unit, earnedXp);
  }, [props.unit.characteristics.xp]);

  React.useEffect(() => {
    if (props.unit.characteristics.level <= 1 || !previousLVL) return;

    notify_UnitEarnedLevel();
  }, [props.unit.characteristics.level]);

  if (!isUnitVisible) return null;

  return (
    <>
      <div
        data-rotation={normalizeRotation(props.unit.rotation.deg, 4).deg}
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
        onMouseMove={(e: React.MouseEvent) => {
          if (props.onMouseMove) {
            props.onMouseMove(e, props.unit);
          }
        }}
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
          ...unitCssProps,
          clipPath: props.unit.getClipPath(),
          ...props.style,
        }}
      >
        <div className="char"></div>
      </div>

      <UnitAdditionalInfo unit={props.unit} unitCssProps={unitCssProps} />

      {/*{isUnitShadowsEnabled ? (*/}
      {/*  <div*/}
      {/*    className={`${props.unit.className} unit-shadows-container`}*/}
      {/*    data-rotation={normalizeRotation(props.unit.rotation.deg, 4).deg}*/}
      {/*    data-action={props.unit.action}*/}
      {/*    data-weapon={props.unit.getCurrentWeapon()?.dictEntity.type}*/}
      {/*    style={unitCssProps}*/}
      {/*  >*/}
      {/*    {props.unit.shadows.map((shadow, index) => (*/}
      {/*      <UnitShadowComponent key={index} shadow={shadow} />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*) : null}*/}
    </>
  );
});
