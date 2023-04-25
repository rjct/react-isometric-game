import React from "react";
import { MiniMap } from "./MiniMap";
import { Unit } from "../../engine/UnitFactory";
import { HeroActionControl } from "./HeroActionControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToDot, faPersonRunning, faPersonWalking, faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { Button } from "../ui/Button";

export function ControlPanel() {
  const { hero } = useHero();

  const { gameDispatch, uiDispatch, gameState } = useGameState();

  const centerMapOnHero = () => {
    uiDispatch({ type: "centerMapOnHero", unitCoordinates: gameState.gridToScreenSpace(hero.position) });
  };

  const handleCurrentHeroActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hero.isMoving()) return;

    const selectedAction = e.target.value as Unit["currentSelectedAction"];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction });
  };

  const handleInventoryButtonClick = () => {
    uiDispatch({ type: "toggleInventory" });
  };

  return (
    <div className={"control-panel"}>
      <MiniMap />

      <div className={"hero-controls"}>
        <Button title={"Center map (C)"} className={["control-center-map"]} onClick={centerMapOnHero}>
          <FontAwesomeIcon icon={faArrowsToDot} size={"2xl"} />
        </Button>

        <Button title={"Inventory (I)"} className={["control-inventory"]} onClick={handleInventoryButtonClick}>
          <FontAwesomeIcon icon={faSuitcaseRolling} size={"2xl"} />
        </Button>

        <Button
          className={["control-left-hand"]}
          active={hero.currentSelectedAction === "useLeftHand"}
          disabled={hero.isMoving()}
        >
          <HeroActionControl
            action={"useLeftHand"}
            selected={hero.currentSelectedAction === "useLeftHand"}
            onChange={handleCurrentHeroActionChange}
            weapon={hero.inventory.leftHand!}
          />
        </Button>

        <Button
          className={["control-right-hand"]}
          active={hero.currentSelectedAction === "useRightHand"}
          disabled={hero.isMoving()}
        >
          <HeroActionControl
            action={"useRightHand"}
            selected={hero.currentSelectedAction === "useRightHand"}
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
            text={<FontAwesomeIcon icon={faPersonWalking} size={"2xl"} />}
          />
        </Button>

        <Button className={["control-run"]} active={hero.currentSelectedAction === "run"} disabled={hero.isMoving()}>
          <HeroActionControl
            action={"run"}
            selected={hero.currentSelectedAction === "run"}
            onChange={handleCurrentHeroActionChange}
            title={"Run"}
            text={<FontAwesomeIcon icon={faPersonRunning} size={"2xl"} />}
          />
        </Button>
      </div>
    </div>
  );
}
