import { UnitShadowComponent } from "@src/components/viewport/layers/userInteraction/units/UnitShadow";
import { UnitCooldownTimer } from "@src/components/viewport/layers/userInteraction/units/additionalInfo/UnitCooldownTimer";
import { UnitEnemyInViewMark } from "@src/components/viewport/layers/userInteraction/units/additionalInfo/UnitEnemyInViewMark";
import { UnitHealth } from "@src/components/viewport/layers/userInteraction/units/additionalInfo/UnitHealth";
import { Unit } from "@src/engine/unit/UnitFactory";
import { normalizeRotation } from "@src/engine/weapon/helpers";
import { useGameState } from "@src/hooks/useGameState";
import React, { CSSProperties } from "react";

export const UnitAdditionalInfo = (props: { unit: Unit; unitCssProps: CSSProperties }) => {
  const { gameState } = useGameState();

  const isUnitShadowsEnabled = React.useMemo(() => {
    return gameState.settings.featureEnabled.unitShadow;
  }, [gameState.settings.featureEnabled.unitShadow]);

  return (
    <div
      className={`${props.unit.className} unit-additional`}
      data-rotation={normalizeRotation(props.unit.rotation.deg, 4).deg}
      data-action={props.unit.action}
      data-weapon={props.unit.getCurrentWeapon()?.dictEntity.type}
      style={props.unitCssProps}
    >
      <div className={"unit-info"}>
        <UnitEnemyInViewMark unit={props.unit} />
        <UnitCooldownTimer unit={props.unit} />
        <UnitHealth unit={props.unit} />
        {/*<UnitActionPoints unit={props.unit} />*/}
      </div>

      {isUnitShadowsEnabled ? (
        <div className={"unit-shadows-container"}>
          {props.unit.shadows.map((shadow, index) => (
            <UnitShadowComponent key={index} shadow={shadow} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
