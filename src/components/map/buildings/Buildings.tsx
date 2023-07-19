import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useHero } from "../../../hooks/useHero";
import { BuildingBox } from "./BuildingBox";
import { BuildingComponent } from "./Building";

export const Buildings = React.memo(function Buildings() {
  const { gameState, uiState } = useGameState();
  const { hero, getHeroMaskImage } = useHero();

  const buildings = React.useMemo(
    () =>
      gameState.buildings
        .filter((building) => gameState.isEntityInViewport(building, uiState.viewport))
        .map((building) =>
          gameState.debug.featureEnabled.buildingBoxes ? (
            <BuildingBox key={building.id} building={building} maskImage={getHeroMaskImage(building)} />
          ) : (
            <BuildingComponent key={building.id} building={building} maskImage={getHeroMaskImage(building)} />
          ),
        ),
    [uiState.viewport, hero.getHash(), gameState.debug.featureEnabled.buildingBoxes],
  );

  return uiState.scene === "game" ||
    uiState.scene === "combat" ||
    (uiState.scene === "editor" && uiState.editorMode === "lights") ? (
    <>{buildings}</>
  ) : null;
});
