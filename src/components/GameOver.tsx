import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { useScene } from "@src/hooks/useScene";

export function GameOver() {
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["gameOver"])) return null;

  return (
    <FullscreenPanel overlay={true} classNames={["game-over"]}>
      Game over
    </FullscreenPanel>
  );
}
