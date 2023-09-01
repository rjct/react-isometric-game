import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";

export function BuildingOccupiesCellSwitch() {
  const { gameState, gameDispatch } = useGameState();

  if (!gameState.selectedBuilding) {
    return null;
  }

  return (
    <Switch
      title={""}
      checked={gameState.selectedBuilding.occupiesCell}
      onChange={(e) => {
        gameDispatch({
          type: "setBuildingOccupiesCell",
          entityId: gameState.selectedBuilding.id,
          value: e.target.checked,
        });
      }}
    />
  );
}
