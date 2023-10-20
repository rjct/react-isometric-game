import { UnitComponent } from "@src/components/map/units/Unit";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const Units = React.memo(function Units() {
  const { gameState, gameDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  React.useEffect(() => {
    gameDispatch({ type: "recalculateUnitFieldOfView" });
  }, [gameState.getAllAliveUnitsHash()]);

  if (!checkCurrentScene(["game", "combat"])) return null;

  return (
    <>
      {Object.keys(gameState.units).map((unitId) => (
        <UnitComponent
          key={unitId}
          unit={gameState.units[unitId]}
          isInHeroView={unitId === gameState.heroId || gameState.getHero().fieldOfView.isEntityInView(unitId)}
        />
      ))}
    </>
  );
});
