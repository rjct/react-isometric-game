import { Buildings } from "@src/components/viewport/layers/userInteraction/buildings/Buildings";
import { Units } from "@src/components/viewport/layers/userInteraction/units/Units";
import { Vehicles } from "@src/components/viewport/layers/userInteraction/vehicles/Vehicles";
import { VisualEffects } from "@src/components/viewport/layers/visualEffects/VisualEffects";
import { GameLayer } from "@src/components/viewport/_shared/GameLayer";
import { Unit } from "@src/engine/unit/UnitFactory";
import { useGameState } from "@src/hooks/useGameState";
import { HeroActionType, useHero, UserEventType } from "@src/hooks/useHero";
import { useMousePosition } from "@src/hooks/useMousePosition";
import { useScene } from "@src/hooks/useScene";
import React from "react";
import { isMobile } from "react-device-detect";

export const UserInteraction = () => {
  const { gameState, gameDispatch } = useGameState();
  const { hero, doHeroAction } = useHero();
  const { heroAction } = useMousePosition();
  const { checkCurrentScene } = useScene();

  const [clicks, setClicks] = React.useState(0);
  const [currentActionType, setCurrentActionType] = React.useState<HeroActionType | null>(null);
  const handleMapMouseEvent = (type: UserEventType, heroActionIndex: number) => {
    const action = heroAction.at(heroActionIndex);
    const isAllowed = action && action.isAllowed && action.possibleUserEventTypes.includes(type);

    if (isAllowed) {
      doHeroAction(type, action).then((heroActionType: HeroActionType) => {
        setCurrentActionType(heroActionType);
      });
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const userActions: Array<Unit["currentSelectedAction"]> = ["move", "loot", "leftHand", "rightHand"];

    const currentActionIndex = userActions.indexOf(hero.currentSelectedAction);
    const nextActionIndex = currentActionIndex + 1 >= userActions.length ? 0 : currentActionIndex + 1;
    const nextAction = userActions[nextActionIndex];

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: nextAction });
  };

  React.useEffect(() => {
    if (hero.action === "none") {
      setCurrentActionType(null);
    }
  }, [hero.action]);

  React.useEffect(() => {
    let singleClickTimer: number;

    if (clicks === 1) {
      singleClickTimer = window.setTimeout(
        function () {
          handleMapMouseEvent("click", 0);
          setClicks(0);
        },
        isMobile ? 150 : 250,
      );
    } else if (clicks === 2) {
      handleMapMouseEvent("doubleClick", -1);
      setClicks(0);
    }

    return () => window.clearTimeout(singleClickTimer);
  }, [clicks]);

  if (checkCurrentScene(["editor"])) return null;

  return (
    <GameLayer
      size={gameState.mapSize}
      className={"user-interactions"}
      isometric={gameState.debug.featureEnabled.buildingBoxes}
      dataProps={{
        "data-action": currentActionType || heroAction[0]?.action,
        "data-action-allowed": heroAction[0]?.isAllowed ? undefined : false,
      }}
      onClick={() => setClicks(clicks + 1)}
      onMouseDown={() => handleMapMouseEvent("mouseDown", -1)}
      onMouseUp={() => handleMapMouseEvent("mouseUp", -1)}
      onContextMenu={handleRightClick}
    >
      <VisualEffects />
      <Buildings />
      <Vehicles />
      <Units />
    </GameLayer>
  );
};
