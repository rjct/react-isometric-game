import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { EntityOverviewPanel } from "@src/components/_modals/inventory/_shared/EntityOverviewPanel";
import { DerivedStats } from "@src/components/_modals/unit_characteristics/DerivedStats";
import { SkillOverview } from "@src/components/_modals/unit_characteristics/SkillOverview";
import { Skills } from "@src/components/_modals/unit_characteristics/Skills";
import { SPECIAL } from "@src/components/_modals/unit_characteristics/SPECIAL";
import { GameUnitCreationContext } from "@src/context/GameUnitCreationContext";
import { UnitDerivedStatName } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";
export function UnitCharacteristics() {
  const { gameState, uiDispatch } = useGameState();
  const { checkCurrentScene, scenesHistory } = useScene();

  const [selectedStat, setSelectedStat] = React.useState<
    UnitSkillName | UnitPrimaryStatName | UnitDerivedStatName | null
  >(null);

  const unit = React.useMemo(() => {
    return gameState.selectedUnit || gameState.getHero();
  }, [gameState.selectedUnit, gameState.getHero()]);

  if (!checkCurrentScene(["unitCharacteristics"])) return null;

  const handleClickOut = () => {
    setSelectedStat(null);
  };

  const handleHeroCreationDoneButtonClick = () => {
    const scene = scenesHistory.at(-2) === "editor" ? "editor" : "game";

    uiDispatch({ type: "setScene", scene });
  };

  const handleHeroCreationCancelButtonClick = () => {
    uiDispatch({ type: "setScene", scene: scenesHistory.at(-2)! });
  };

  return (
    <FullscreenPanel overlay={true} onClick={handleClickOut}>
      <div className={"modal"}>
        <div className={"modal-content hero-creation"}>
          <GameUnitCreationContext.Provider value={{ selectedStat, setSelectedStat }}>
            <SPECIAL unit={unit} />
            <Skills unit={unit} />
            <DerivedStats unit={unit} />
            <SkillOverview />
            <EntityOverviewPanel entity={unit} className={["hero-overview-wrapper"]} title={unit.type} />
          </GameUnitCreationContext.Provider>
        </div>

        <div className={"modal-controls"}>
          <Button onClick={handleHeroCreationCancelButtonClick}>
            <label>Cancel</label>
          </Button>

          <Button className={["ui-button-green"]} onClick={handleHeroCreationDoneButtonClick}>
            <label>Done</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
