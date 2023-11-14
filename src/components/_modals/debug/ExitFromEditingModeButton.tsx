import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export const ExitFromEditingModeButton = () => {
  const { uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["editor"])) return null;

  const handleEditMapButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "game" });
  };

  return (
    <Button onClick={handleEditMapButtonClick}>
      <label>Exit from editing mode</label>
    </Button>
  );
};
