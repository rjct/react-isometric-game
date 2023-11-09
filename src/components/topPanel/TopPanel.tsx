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
        <HeroPoints points={hero.characteristics.actionPoints} title={"Action points"} shortTitle={"AP"} />
      </fieldset>

      <fieldset>
        <HeroPoints points={hero.characteristics.healthPoints} title={"Health points"} shortTitle={"HP"} />
      </fieldset>

      <DebugInfo />
    </div>
  );
});
