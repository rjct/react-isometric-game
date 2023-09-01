import { constants } from "@src/constants";
import { GameContext } from "@src/hooks/useGameState";

export function introScene(this: GameContext, deltaTime: number) {
  const { uiState, uiDispatch } = this;

  uiDispatch({ type: "setIntroSceneElapsedTime", deltaTime: deltaTime * 1000 });

  if (uiState.introSceneElapsedTime >= constants.INTRO_SCENE_DISPLAY_TIME) {
    uiDispatch({ type: "setScene", scene: "mainMenu" });
  }
}
