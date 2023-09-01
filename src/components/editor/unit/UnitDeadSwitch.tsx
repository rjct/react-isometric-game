import { Switch } from "@src/components/ui/Switch";
import { useGameState } from "@src/hooks/useGameState";

export function UnitDeadSwitch() {
  const { gameState, gameDispatch } = useGameState();

  if (!gameState.selectedUnit) {
    return null;
  }

  return (
    <Switch
      title={""}
      checked={gameState.selectedUnit.isDead}
      disabled={gameState.selectedUnit.isHero}
      onChange={(e) => {
        gameDispatch({
          type: "setUnitDead",
          entityId: gameState.selectedUnit.id,
          isDead: e.target.checked,
        });

        if (!e.target.checked) {
          gameDispatch({ type: "recalculateUnitFieldOfView", unit: gameState.selectedUnit });
        }
      }}
    />
  );
}
