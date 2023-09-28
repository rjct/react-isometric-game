import { CenterMapButton } from "@src/components/controlPanel/CenterMapButton";
import { EndCombatButton } from "@src/components/controlPanel/EndCombatButton";
import { EndTurnButton } from "@src/components/controlPanel/EndTurnButton";
import { HeroExploreButton } from "@src/components/controlPanel/HeroExploreButton";
import { HeroHandButton } from "@src/components/controlPanel/HeroHandButton";
import { HeroMovementButton } from "@src/components/controlPanel/HeroMovementButton";
import { OpenInventoryButton } from "@src/components/controlPanel/OpenInventoryButton";
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

        <HeroMovementButton />
        <HeroExploreButton />

        <EndTurnButton />
        <EndCombatButton />
      </div>
    </div>
  );
});
