import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { DebugFeaturesSwitches } from "@src/components/_modals/debug/DebugFeaturesSwitches";
import { DebugStartCombatButton } from "@src/components/_modals/debug/DebugStartCombatButton";
import { DebugSwitch } from "@src/components/_modals/debug/DebugSwitch";
import { GameFeaturesSwitches } from "@src/components/_modals/debug/GameFeatureSwitches";
import { MapInfo } from "@src/components/_modals/debug/MapInfo";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const DebugSettings = React.memo(() => {
  const { checkCurrentScene, scenesHistory } = useScene();
  const { uiDispatch } = useGameState();

  if (!checkCurrentScene(["debugSetting"])) return null;

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  return (
    <FullscreenPanel overlay={true}>
      <div className={"modal"}>
        <div className={"modal-content debug-settings"}>
          <MapInfo />
          <GameFeaturesSwitches />
          <DebugFeaturesSwitches />
        </div>

        <div className={"modal-controls"}>
          <DebugSwitch />
          <div className={"divider"}></div>
          <DebugStartCombatButton />
          <div className={"divider"}></div>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
});
