import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

import { GameSettingsFeature } from "@src/engine/constants";

export const GameFeaturesSwitches = React.memo(function DebugFeaturesSwitches() {
  const { gameState, gameDispatch } = useGameState();

  const handleSettingFeatureSwitch = (e: React.ChangeEvent<HTMLInputElement>, featureName: GameSettingsFeature) => {
    gameDispatch({
      type: "toggleFeature",
      featureName,
      featureEnabled: e.target.checked,
    });
  };

  return (
    <fieldset className={"game-features"} data-editable={true}>
      <legend className={"outlined"}>Game features</legend>

      <div className={"body"}>
        {Object.entries(gameState.settings.featureEnabled).map(([key, value]) => {
          return (
            <div className={"list-row"} key={key}>
              <div className={"list-row-body"}>{key}</div>

              <div className={"list-row-controls"}>
                <Switch checked={value} onChange={(e) => handleSettingFeatureSwitch(e, key as GameSettingsFeature)} />
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
});
