import { BuildingComponent } from "@src/components/map/buildings/Building";
import { BuildingBox } from "@src/components/map/buildings/BuildingBox";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

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
            <BuildingComponent
              key={building.id}
              building={building}
              maskImage={getHeroMaskImage(building)}
              highlightedForInventoryTransfer={gameState.highlightedEntityForInventoryTransfer?.id === building.id}
              selectedForInventoryTransfer={gameState.selectedEntityForInventoryTransfer?.id === building.id}
              isInHeroView={hero.fieldOfView.entitiesInView.some((entityInView) => entityInView.id === building.id)}
            />
          ),
        ),
    [
      uiState.viewport,
      hero.getHash(),
      gameState.debug.featureEnabled.buildingBoxes,
      gameState.highlightedEntityForInventoryTransfer,
      gameState.selectedEntityForInventoryTransfer,
    ],
  );

  return uiState.scene === "game" ||
    uiState.scene === "combat" ||
    (uiState.scene === "editor" && uiState.editorMode === "lights" && gameState.debug.featureEnabled.buildingBoxes) ? (
    <>{buildings}</>
  ) : null;
});
