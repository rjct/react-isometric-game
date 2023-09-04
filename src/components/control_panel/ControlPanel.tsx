import { faArrowsToDot, faPersonRunning, faPersonWalking, faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeroActionControl } from "@src/components/control_panel/HeroActionControl";
import { Button } from "@src/components/ui/Button";
import { Unit } from "@src/engine/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const ControlPanel = React.memo(function ControlPanel() {
  const { gameState, gameDispatch, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { hero } = useHero();

  if (!checkCurrentScene(["game", "combat"])) return null;

  const handleCenterMapOnHeroClick = () => {
    uiDispatch({ type: "centerMapOnHero", unitCoordinates: hero.screenPosition.screen });
  };

  const handleCurrentHeroActionButtonClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hero.isMoving()) return;

    const selectedAction = e.target.value as Unit["currentSelectedAction"];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction });
  };

  const handleInventoryButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "inventory" });
  };

  const handleEndTurnButtonClick = () => {
    hero.stop();
    hero.restoreActionPoints();
    gameDispatch({ type: "endTurn" });
  };

  const handleEndCombatButtonClick = () => {
    gameDispatch({ type: "endCombat" });
    uiDispatch({ type: "setScene", scene: "game" });
  };

  return (
    <div className={"control-panel"}>
      <div className={"hero-controls"}>
        <Button title={"Center map (C)"} className={["control-center-map"]} onClick={handleCenterMapOnHeroClick}>
          <label>
            <FontAwesomeIcon icon={faArrowsToDot} size={"lg"} />
          </label>
        </Button>

        <Button title={"Inventory (I)"} className={["control-inventory"]} onClick={handleInventoryButtonClick}>
          <label>
            <FontAwesomeIcon icon={faSuitcaseRolling} size={"lg"} />
          </label>
        </Button>

        <Button
          className={["control-left-hand"]}
          active={hero.currentSelectedAction === "leftHand"}
          disabled={hero.isMoving()}
        >
          <HeroActionControl
            action={"leftHand"}
            selected={hero.currentSelectedAction === "leftHand"}
            onChange={handleCurrentHeroActionButtonClick}
            weapon={hero.inventory.leftHand!}
          />
        </Button>

        <Button
          className={["control-right-hand"]}
          active={hero.currentSelectedAction === "rightHand"}
          disabled={hero.isMoving()}
        >
          <HeroActionControl
            action={"rightHand"}
            selected={hero.currentSelectedAction === "rightHand"}
            onChange={handleCurrentHeroActionButtonClick}
            weapon={hero.inventory.rightHand!}
          />
        </Button>

        <Button className={["control-walk"]} active={hero.currentSelectedAction === "walk"} disabled={hero.isMoving()}>
          <HeroActionControl
            action={"walk"}
            selected={hero.currentSelectedAction === "walk"}
            onChange={handleCurrentHeroActionButtonClick}
            title={"Walk"}
            text={<FontAwesomeIcon icon={faPersonWalking} size={"lg"} />}
          />
        </Button>

        <Button className={["control-run"]} active={hero.currentSelectedAction === "run"} disabled={hero.isMoving()}>
          <HeroActionControl
            action={"run"}
            selected={hero.currentSelectedAction === "run"}
            onChange={handleCurrentHeroActionButtonClick}
            title={"Run"}
            text={<FontAwesomeIcon icon={faPersonRunning} size={"lg"} />}
          />
        </Button>

        <Button
          className={["control-end-turn"]}
          disabled={!checkCurrentScene(["combat"]) || gameState.combatQueue.currentUnitId !== hero.id}
          onClick={handleEndTurnButtonClick}
        >
          <label>End Turn</label>
        </Button>

        <Button
          className={["control-end-combat"]}
          disabled={!checkCurrentScene(["combat"]) || gameState.combatQueue.currentUnitId !== hero.id}
          onClick={handleEndCombatButtonClick}
        >
          <label>End Combat</label>
        </Button>
      </div>
    </div>
  );
});
