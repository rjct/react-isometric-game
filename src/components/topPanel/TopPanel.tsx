import React from "react";

import { DebugInfo } from "@src/components/debug/DebugInfo";
import { HeroPoints } from "@src/components/topPanel/HeroPoints";
import { PauseButton } from "@src/components/topPanel/PauseButton";
import { ExitFromEditingModeButton } from "@src/components/_modals/debug/ExitFromEditingModeButton";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";

export const TopPanel = React.memo(function Top() {
  const { hero } = useHero();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["game", "combat", "editor"])) return null;

  return (
    <div className={"top-wrapper"}>
      <PauseButton />
      <ExitFromEditingModeButton />

      <fieldset className={"block x3"}></fieldset>

      {hero.isVehicleInUse() ? (
        <fieldset>
          <HeroPoints
            style={"red"}
            title={"Vehicle HP"}
            shortTitle={"AP"}
            progress={hero.getVehicleInUse()!.characteristics.healthPoints}
            label={hero.getVehicleInUse()!.characteristics.healthPoints}
            warnPercent={50}
            criticalPercent={20}
          />
        </fieldset>
      ) : null}

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
          progress={{
            value: hero.characteristics.levelProgressInPercent,
            max: 100,
          }}
          warnPercent={-1}
          criticalPercent={-1}
        />
      </fieldset>

      <DebugInfo />
    </div>
  );
});
