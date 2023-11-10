import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { DerivedStats } from "@src/components/_modals/hero_creation/DerivedStats";
import { SkillOverview } from "@src/components/_modals/hero_creation/SkillOverview";
import { Skills } from "@src/components/_modals/hero_creation/Skills";
import { SPECIAL } from "@src/components/_modals/hero_creation/SPECIAL";
import { EntityOverviewPanel } from "@src/components/_modals/inventory/_shared/EntityOverviewPanel";
import { GameUnitCreationContext } from "@src/context/GameUnitCreationContext";
import { UnitDerivedStatName } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";
export function HeroCreation() {
  const { uiDispatch } = useGameState();
  const { hero } = useHero();
  const { checkCurrentScene } = useScene();

  const [selectedStat, setSelectedStat] = React.useState<
    UnitSkillName | UnitPrimaryStatName | UnitDerivedStatName | null
  >(null);

  if (!checkCurrentScene(["heroCreation"])) return null;

  const handleClickOut = () => {
    setSelectedStat(null);
  };

  const handleHeroCreationDoneButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "game" });
  };

  const handleHeroCreationCancelButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "mainMenu" });
  };

  return (
    <FullscreenPanel overlay={true} onClick={handleClickOut}>
      <div className={"modal"}>
        <div className={"modal-content hero-creation"}>
          <GameUnitCreationContext.Provider value={{ selectedStat, setSelectedStat }}>
            <SPECIAL />
            <Skills />
            <DerivedStats />
            <SkillOverview />
            <EntityOverviewPanel entity={hero} className={["hero-overview-wrapper"]} title={hero.type} />
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
