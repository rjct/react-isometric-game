import React from "react";
import { Unit } from "../../engine/UnitFactory";
import { HeroActionControl } from "./HeroActionControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToDot, faPersonRunning, faPersonWalking, faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { Button } from "../ui/Button";

export const ControlPanel = React.memo(function ControlPanel() {
  const { hero } = useHero();

  const { gameState, gameDispatch, uiDispatch, uiState } = useGameState();

  const centerMapOnHero = () => {
    uiDispatch({ type: "centerMapOnHero", unitCoordinates: hero.screenPosition });
  };

  const handleCurrentHeroActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hero.isMoving()) return;

    const selectedAction = e.target.value as Unit["currentSelectedAction"];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction });
  };

  const handleInventoryButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "inventory" });
  };

  return uiState.scene === "game" || uiState.scene === "combat" ? (
    <div className={"control-panel"}>
      <div className={"hero-controls"}>
        <Button title={"Center map (C)"} className={["control-center-map"]} onClick={centerMapOnHero}>
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
            onChange={handleCurrentHeroActionChange}
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
            onChange={handleCurrentHeroActionChange}
            weapon={hero.inventory.rightHand!}
          />
        </Button>

        <Button className={["control-walk"]} active={hero.currentSelectedAction === "walk"} disabled={hero.isMoving()}>
          <HeroActionControl
            action={"walk"}
            selected={hero.currentSelectedAction === "walk"}
            onChange={handleCurrentHeroActionChange}
            title={"Walk"}
            text={<FontAwesomeIcon icon={faPersonWalking} size={"lg"} />}
          />
        </Button>

        <Button className={["control-run"]} active={hero.currentSelectedAction === "run"} disabled={hero.isMoving()}>
          <HeroActionControl
            action={"run"}
            selected={hero.currentSelectedAction === "run"}
            onChange={handleCurrentHeroActionChange}
            title={"Run"}
            text={<FontAwesomeIcon icon={faPersonRunning} size={"lg"} />}
          />
        </Button>

        <Button
          className={["control-end-turn"]}
          disabled={uiState.scene !== "combat" || gameState.combatQueue.currentUnitId !== hero.id}
          onClick={() => {
            hero.stop();
            hero.restoreActionPoints();
            gameDispatch({ type: "endTurn" });
          }}
        >
          <label>End Turn</label>
        </Button>

        <Button
          className={["control-end-combat"]}
          disabled={uiState.scene !== "combat" || gameState.combatQueue.currentUnitId !== hero.id}
          onClick={() => {
            gameDispatch({ type: "endCombat" });
            uiDispatch({ type: "setScene", scene: "game" });
          }}
        >
          <label>End Combat</label>
        </Button>
      </div>
    </div>
  ) : null;
});
