import { EndCombatButton } from "@src/components/controlPanel/EndCombatButton";
import { EndTurnButton } from "@src/components/controlPanel/EndTurnButton";
import { GetOufOfVehicleButton } from "@src/components/controlPanel/GetOufOfVehicleButton";
import { HeroHandButton } from "@src/components/controlPanel/HeroHandButton";
import { HeroLootButton } from "@src/components/controlPanel/HeroLootButton";
import { HeroMovementButton } from "@src/components/controlPanel/HeroMovementButton";
import { MiniMap } from "@src/components/controlPanel/MiniMap";
import { OpenInventoryButton } from "@src/components/controlPanel/OpenInventoryButton";
import { VehicleDashboard } from "@src/components/controlPanel/vehicle/VehicleDashboard";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const ControlPanel = React.memo(function ControlPanel() {
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["game", "combat"])) return null;

  return (
    <div className={"control-panel"}>
      <MiniMap />

      <div className={"hero-controls"}>
        <OpenInventoryButton />

        <VehicleDashboard />
        <HeroHandButton type={"leftHand"} />
        <HeroHandButton type={"rightHand"} />

        <HeroMovementButton />
        <HeroLootButton />
        <GetOufOfVehicleButton />

        <EndTurnButton />
        <EndCombatButton />
      </div>
    </div>
  );
});
