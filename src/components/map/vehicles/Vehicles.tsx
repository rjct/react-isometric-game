import { VehicleComponent } from "@src/components/map/vehicles/Vehicle";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const Vehicles = React.memo(function Vehicles() {
  const { gameState, uiState } = useGameState();

  const vehicles = React.useMemo(
    () =>
      gameState.vehicles
        .filter((vehicle) => gameState.isEntityInViewport(vehicle, uiState.viewport))
        .map((vehicle) => (
          <VehicleComponent
            key={vehicle.id}
            vehicle={vehicle}
            highlightedForInventoryTransfer={gameState.highlightedEntityForInventoryTransfer?.id === vehicle.id}
            selectedForInventoryTransfer={gameState.selectedEntityForInventoryTransfer?.id === vehicle.id}
          />
        )),
    [
      uiState.viewport,
      gameState.highlightedEntityForInventoryTransfer,
      gameState.selectedEntityForInventoryTransfer,
      JSON.stringify(gameState.vehicles.map((v) => v.rotation.deg)),
    ],
  );

  return uiState.scene === "game" || uiState.scene === "combat" ? <>{vehicles}</> : null;
});
