import { useGameState } from "../hooks/useGameState";
import { FullscreenPanel } from "./ui/FullscreenPanel";

export function Intro() {
  const { uiState } = useGameState();

  const text = "Intro scene text...";

  return uiState.scene === "intro" ? (
    <FullscreenPanel overlay={false}>
      <div
        className={"intro-title"}
        style={{
          filter: `opacity(${Math.min(1, uiState.introSceneElapsedTime / 4000)})`,
        }}
      >
        INTRO TITLE
      </div>

      <div className={"intro-text"}>
        &nbsp;{text.substring(0, Math.floor(text.length * Math.min(1, (uiState.introSceneElapsedTime - 4000) / 1000)))}
      </div>
    </FullscreenPanel>
  ) : null;
}
