import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { Armor } from "@src/components/_modals/inventory/Armor";
import { Backpack } from "@src/components/_modals/inventory/Backpack";
import { EntityOverview } from "@src/components/_modals/inventory/EntityOverview";
import { Hand } from "@src/components/_modals/inventory/Hand";
import { HeroInfo } from "@src/components/_modals/inventory/HeroInfo";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export function Inventory() {
  const { uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { hero } = useHero();

  const [scenesHistory, saveScenesHistory] = React.useState([uiState.scene]);

  React.useEffect(() => {
    const scenes = [...scenesHistory];

    scenes.push(uiState.scene);

    saveScenesHistory(scenes);

    return () => {
      saveScenesHistory([]);
    };
  }, [uiState.scene]);

  if (!checkCurrentScene(["inventory"])) return null;

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  return (
    <FullscreenPanel overlay={true}>
      <div className={"inventory"}>
        <Backpack owner={hero} />
        <Hand title={"Left hand"} className={"left-hand-wrapper"} inventoryType={"leftHand"} />
        <Hand title={"Right Hand"} className={"right-hand-wrapper"} inventoryType={"rightHand"} />
        <EntityOverview entity={hero} className={["entity-overview-wrapper"]} title={"Hero"} />
        <HeroInfo />
        <Armor />

        <div className={"controls"}>
          <Button onClick={handleCloseButtonClick}>
            <label>Close</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
