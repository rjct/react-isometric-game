import { GameUI } from "../../context/GameUIContext";

export type SetSceneUIReducerAction = {
  type: "setScene";
  scene: GameUI["scene"];
};

export function setScene(state: GameUI, action: SetSceneUIReducerAction) {
  return { ...state, ...{ scene: action.scene } };
}
