import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { useGameState } from "@src/hooks/useGameState";

export function GameOver() {
  const { uiState } = useGameState();

  return uiState.scene === "gameOver" ? (
    <FullscreenPanel overlay={true} classNames={["game-over"]}>
      Game over
    </FullscreenPanel>
  ) : null;
}
