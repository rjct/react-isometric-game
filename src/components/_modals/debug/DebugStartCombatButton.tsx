import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";

export const DebugStartCombatButton = () => {
  const { gameDispatch, uiState, uiDispatch } = useGameState();
  const handleStartCombatButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "combat" });
    gameDispatch({ type: "startCombat" });
  };

  return (
    <Button
      className={["control-end-combat"]}
      disabled={uiState.scene !== "game"}
      onClick={handleStartCombatButtonClick}
    >
      <label style={{ whiteSpace: "nowrap" }}>start combat</label>
    </Button>
  );
};
