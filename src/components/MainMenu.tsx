import { useGameState } from "../hooks/useGameState";
import { FullscreenPanel } from "./ui/FullscreenPanel";
import { Button } from "./ui/Button";

export function MainMenu() {
  const { uiState, uiDispatch } = useGameState();

  return uiState.scene === "mainMenu" ? (
    <FullscreenPanel classNames={["main-menu"]} overlay={true}>
      <div className={"game-title"}>Game title</div>

      <div className={"main-menu-nav"}>
        <Button
          className={["ui-button-green"]}
          onClick={() => {
            uiState.introSceneElapsedTime = 0;
            uiDispatch({ type: "setScene", scene: "intro" });
          }}
        >
          <label>Intro</label>
        </Button>

        <Button
          className={["ui-button-green"]}
          onClick={() => {
            uiDispatch({ type: "setScene", scene: "game" });
          }}
        >
          <label>New game</label>
        </Button>

        <Button
          className={["ui-button-green"]}
          onClick={() => {
            uiDispatch({ type: "setScene", scene: "editor" });
          }}
        >
          <label>Map editor</label>
        </Button>
      </div>
    </FullscreenPanel>
  ) : null;
}
