import { UnitComponent } from "@src/components/map/layers/userInteraction/units/Unit";
import { useGameEntityInteraction } from "@src/hooks/useGameEntityInteraction";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const Units = React.memo(function Units() {
  const { gameState, gameDispatch } = useGameState();
  const { checkCurrentScene } = useScene();
  const { handleEntityMouseMove } = useGameEntityInteraction();

  React.useEffect(() => {
    gameDispatch({ type: "recalculateUnitFieldOfView" });
  }, [gameState.getAllAliveUnitsHash(), gameState.getVehiclesHash()]);

  if (!checkCurrentScene(["game", "combat"])) return null;

  return (
    <>
      {Object.entries(gameState.units).map(([unitId, unit]) => (
        <UnitComponent
          key={unitId}
          unit={gameState.units[unitId]}
          isInHeroView={unitId === gameState.heroId || gameState.getHero().fieldOfView.isEntityInView(unit)}
          onMouseMove={handleEntityMouseMove}
        />
      ))}
    </>
  );
});
