import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeroActionControl } from "@src/components/control_panel/HeroActionControl";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const HeroMovementButton = React.memo((props: { type: "walk" | "run"; title: string; icon: IconDefinition }) => {
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
        title={props.title}
        text={<FontAwesomeIcon icon={props.icon} size={"lg"} />}
      />
    </Button>
  );
});
