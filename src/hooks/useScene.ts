import { GameScene } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";

export function useScene() {
  const { uiState } = useGameState();
  const checkCurrentScene = (sceneNames: GameScene[]) => {
    return sceneNames.includes(uiState.scene);
  };

  return { checkCurrentScene };
}
