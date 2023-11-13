import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export function MainMenu() {
  const { uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["mainMenu"])) return null;

  const handleIntroButtonClick = () => {
    uiState.introSceneElapsedTime = 0;
    uiDispatch({ type: "setScene", scene: "intro" });
  };

  const handleNewGameButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "unitCharacteristics" });
  };

  const handleEditorButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "editor" });
  };

  return (
    <FullscreenPanel classNames={["main-menu"]} overlay={true}>
      <div className={"game-title"}>Game title</div>

      <div className={"main-menu-nav"}>
        <Button className={["ui-button-green"]} onClick={handleIntroButtonClick}>
          <label>Intro</label>
        </Button>

        <Button className={["ui-button-green"]} onClick={handleNewGameButtonClick}>
          <label>New game</label>
        </Button>

        <Button className={["ui-button-green"]} onClick={handleEditorButtonClick}>
          <label>Map editor</label>
        </Button>
      </div>
    </FullscreenPanel>
  );
}
