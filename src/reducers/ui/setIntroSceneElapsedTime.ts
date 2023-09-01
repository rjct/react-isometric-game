import { GameUI } from "@src/context/GameUIContext";

export type SetIntroSceneElapsedTimeUIReducerAction = {
  type: "setIntroSceneElapsedTime";
  deltaTime: number;
};

export function setIntroSceneElapsedTime(state: GameUI, action: SetIntroSceneElapsedTimeUIReducerAction) {
  state.introSceneElapsedTime += action.deltaTime;

  return { ...state };
}
