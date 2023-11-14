import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { GameLogo } from "@src/components/_modals/_shared/GameLogo";
import { GameTitle } from "@src/components/_modals/_shared/GameTitle";
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
    <FullscreenPanel overlay={true}>
      <div className={"modal-menu"}>
        <GameLogo />
        <GameTitle />

        <div className={"modal-menu-nav"}>
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
      </div>
    </FullscreenPanel>
  );
}
