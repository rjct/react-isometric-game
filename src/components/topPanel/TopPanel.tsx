import React from "react";

import { DebugEditorSwitch } from "@src/components/debug/DebugEditorSwitch";
import { DebugInfo } from "@src/components/debug/DebugInfo";
import { DebugMapPath } from "@src/components/debug/DebugMapPath";
import { DebugMapSelector } from "@src/components/debug/DebugMapSelector";
import { DebugSwitch } from "@src/components/debug/DebugSwitch";
import { HeroPoints } from "@src/components/topPanel/HeroPoints";
import { useHero } from "@src/hooks/useHero";

export const TopPanel = React.memo(function Top() {
  const { hero } = useHero();

  return (
    <div className={"top-wrapper"}>
      <fieldset className={"block top"}>
        <DebugMapPath />

        <div className={"title"}>
          <DebugSwitch />
          <DebugMapSelector />
        </div>

        <div className={"value"}>
          <DebugEditorSwitch />
        </div>
      </fieldset>
      <fieldset>
        <HeroPoints
          style={"red"}
          title={"Action points"}
          shortTitle={"AP"}
          progress={hero.characteristics.derived.actionPoints}
          label={hero.characteristics.derived.actionPoints}
          warnPercent={50}
          criticalPercent={20}
        />
      </fieldset>
      <fieldset>
        <HeroPoints
          style={"red"}
          title={"Health points"}
          shortTitle={"HP"}
          progress={hero.characteristics.derived.healthPoints}
          label={hero.characteristics.derived.healthPoints}
          warnPercent={50}
          criticalPercent={20}
        />
      </fieldset>

      <fieldset>
        <HeroPoints
          title={"Level"}
          shortTitle={"LVL"}
          label={{ value: hero.characteristics.level }}
          progress={{ value: hero.characteristics.xp, max: hero.characteristics.xpRemainingToNextLevel }}
          warnPercent={-1}
          criticalPercent={-1}
        />
      </fieldset>
      <DebugInfo />
    </div>
  );
});
