import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { BuildingComponent } from "./Building";
import { useHero } from "../../../hooks/useHero";

export const Buildings = React.memo(function Buildings() {
  const { gameState, uiState } = useGameState();
  const { hero, getHeroMaskImage } = useHero();

  const buildings = React.useMemo(
    () =>
      gameState.buildings
        .filter((building) => gameState.isEntityInViewport(building, uiState.viewport))
        .map((building) => (
          <BuildingComponent key={building.id} building={building} maskImage={getHeroMaskImage(building)} />
        )),
    [uiState.viewport, hero.getHash()]
  );

  return uiState.scene === "game" || uiState.scene === "combat" ? <>{buildings}</> : null;
});
