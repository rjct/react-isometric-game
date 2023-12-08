import { VehicleComponent } from "@src/components/map/layers/userInteraction/vehicles/Vehicle";
import { useGameEntityInteraction } from "@src/hooks/useGameEntityInteraction";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const Vehicles = React.memo(function Vehicles() {
  const { gameState, uiState } = useGameState();
  const { handleEntityMouseMove } = useGameEntityInteraction();

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
            onMouseMove={handleEntityMouseMove}
          />
        )),
    [
      uiState.viewport,
      gameState.highlightedEntityForInventoryTransfer,
      gameState.selectedEntityForInventoryTransfer,
      gameState.getVehiclesHash(),
    ],
  );

  return uiState.scene === "game" || uiState.scene === "combat" ? <>{vehicles}</> : null;
});
