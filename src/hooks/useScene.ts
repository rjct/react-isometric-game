import { GameScene } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function useScene() {
  const { uiState } = useGameState();
  const [scenesHistory, saveScenesHistory] = React.useState([uiState.scene]);

  const checkCurrentScene = (sceneNames: GameScene[]) => {
    return sceneNames.includes(uiState.scene);
  };

  React.useEffect(() => {
    const scenes = [...scenesHistory];

    scenes.push(uiState.scene);

    saveScenesHistory(scenes);

    return () => {
      saveScenesHistory([]);
    };
  }, [uiState.scene]);

  return { checkCurrentScene, scenesHistory };
}
