import { useGameState } from "../hooks/useGameState";
import { FullscreenPanel } from "./ui/FullscreenPanel";

export function GameOver() {
  const { uiState } = useGameState();

  return uiState.scene === "gameOver" ? (
    <FullscreenPanel overlay={true} classNames={["game-over"]}>
      Game over
    </FullscreenPanel>
  ) : null;
}
