import { GameContext } from "../../hooks/useGameState";
import { constants } from "../../constants";

export function introScene(this: GameContext, deltaTime: number) {
  const { uiState, uiDispatch } = this;

  uiDispatch({ type: "setIntroSceneElapsedTime", deltaTime: deltaTime * 1000 });

  if (uiState.introSceneElapsedTime >= constants.INTRO_SCENE_DISPLAY_TIME) {
    uiDispatch({ type: "setScene", scene: "mainMenu" });
  }
}
