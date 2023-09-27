import { HeroActionControl } from "@src/components/controlPanel/HeroActionControl";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const HeroHandButton = React.memo((props: { type: "leftHand" | "rightHand" }) => {
  const { gameDispatch } = useGameState();
  const { hero } = useHero();

  const handleChange = () => {
    if (hero.isMoving()) return;

    gameDispatch({ type: "setCurrentUnitAction", unit: hero, selectedAction: props.type });
  };

  return (
    <Button
      className={[`control-${props.type}`]}
      active={hero.currentSelectedAction === props.type}
      disabled={hero.isMoving()}
    >
      <HeroActionControl
        action={props.type}
        selected={hero.currentSelectedAction === props.type}
        onChange={handleChange}
        weapon={hero.inventory[props.type]!}
      />
    </Button>
  );
});
