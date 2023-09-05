import { faPersonRunning, faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { CenterMapButton } from "@src/components/control_panel/CenterMapButton";
import { EndCombatButton } from "@src/components/control_panel/EndCombatButton";
import { EndTurnButton } from "@src/components/control_panel/EndTurnButton";
import { HeroHandButton } from "@src/components/control_panel/HeroHandButton";
import { HeroMovementButton } from "@src/components/control_panel/HeroMovementButton";
import { OpenInventoryButton } from "@src/components/control_panel/OpenInventoryButton";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const ControlPanel = React.memo(function ControlPanel() {
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["game", "combat"])) return null;

  return (
    <div className={"control-panel"}>
      <div className={"hero-controls"}>
        <CenterMapButton />
        <OpenInventoryButton />

        <HeroHandButton type={"leftHand"} />
        <HeroHandButton type={"rightHand"} />

        <HeroMovementButton type={"walk"} title={"Walk"} icon={faPersonWalking} />
        <HeroMovementButton type={"run"} title={"Run"} icon={faPersonRunning} />

        <EndTurnButton />
        <EndCombatButton />
      </div>
    </div>
  );
});
