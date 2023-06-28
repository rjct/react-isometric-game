import { GameUI } from "../../context/GameUIContext";

export type UpdateOffscreenCanvasRenderingProgressReducerAction = {
  type: "updateOffscreenCanvasRenderingProgress";
  entity: keyof GameUI["offscreenCanvasRenderingProgress"];
  progress: Omit<OffscreenCanvasRenderingProgress, "data">;
};
export function updateOffscreenCanvasRenderingProgress(
  state: GameUI,
  action: UpdateOffscreenCanvasRenderingProgressReducerAction
) {
  const entity = action.entity;

  state.offscreenCanvasRenderingProgress[entity] = action.progress;

  return state;
}
