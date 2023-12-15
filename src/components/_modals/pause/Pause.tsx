import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { DebugSwitch } from "@src/components/_modals/debug/DebugSwitch";
import { AppVersion } from "@src/components/_modals/_shared/AppVersion";
import { GameLogo } from "@src/components/_modals/_shared/GameLogo";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export function Pause() {
  const { uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["pause"])) return null;

  const handleCloseButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "game" });
  };

  const handleDebugSettingsButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "debugSetting" });
  };

  return (
    <FullscreenPanel overlay={true}>
      <AppVersion />
      <div
        style={{
          position: "absolute",
          display: "flex",
          left: 10,
          top: 10,
        }}
      >
        <DebugSwitch />
        <Button onClick={handleDebugSettingsButtonClick}>
          <label>
            <FontAwesomeIcon icon={faGear} />
          </label>
        </Button>
      </div>

      <div className={"modal-menu"}>
        <GameLogo />
        <div className={"game-title"}>
          <FontAwesomeIcon icon={faPause} fixedWidth={true} fade={true} />
          Pause
        </div>

        <div className={"modal-menu-nav"}>
          <Button className={["ui-button-green"]} onClick={handleCloseButtonClick}>
            <label>Resume</label>
          </Button>

          <Button className={["ui-button-green"]} disabled>
            <label>Save game</label>
          </Button>

          <Button className={["ui-button-green"]} disabled>
            <label>Load game</label>
          </Button>

          <Button className={["ui-button-green"]} disabled>
            <label>Settings</label>
          </Button>
        </div>
      </div>
    </FullscreenPanel>
  );
}
