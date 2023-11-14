import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

import { GameDebugFeature } from "@src/engine/constants";

export const DebugFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch } = useGameState();

  const handleDebugFeatureSwitch = (e: React.ChangeEvent<HTMLInputElement>, featureName: GameDebugFeature) => {
    gameDispatch({
      type: "toggleDebugFeature",
      featureName,
      featureEnabled: e.target.checked,
    });
  };

  return (
    <fieldset className={"debug-features"} data-editable={true}>
      <legend className={"outlined"}>Debug features</legend>

      <div className={"body"}>
        {Object.entries(gameState.debug.featureEnabled).map(([key, value]) => {
          return (
            <div className={"list-row"} key={key}>
              <div className={"list-row-body"}>{key}</div>

              <div className={"list-row-controls"}>
                <Switch checked={value} onChange={(e) => handleDebugFeatureSwitch(e, key as GameDebugFeature)} />
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
});
