import { useGameState } from "../hooks/useGameState";

export function GameOver() {
  const { uiState } = useGameState();

  return uiState.scene === "game-over" ? <div className={"game-over"}>Game over</div> : null;
}
