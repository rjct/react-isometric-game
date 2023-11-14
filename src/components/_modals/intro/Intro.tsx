import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export function Intro() {
  const { uiState } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["intro"])) return null;

  const text = "Intro scene text...";

  return (
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
  );
}
