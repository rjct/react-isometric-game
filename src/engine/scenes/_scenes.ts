import { gameScene } from "./game";
import { GameScene, GameUI } from "../../context/GameUIContext";
import { GameContext } from "../../hooks/useGameState";
import { inventoryScene } from "./inventory";
import { loadingScene } from "./loading";
import { editorScene } from "./editor";
import { combatScene } from "./combat";
import { gameOverScene } from "./gameOver";

type SceneRunnerFunc = (this: GameContext, deltaTime: number) => void;

const scenes: { [sceneName in GameScene]: SceneRunnerFunc } = {
  loading: loadingScene,
  game: gameScene,
  combat: combatScene,
  inventory: inventoryScene,
  editor: editorScene,
  gameOver: gameOverScene,
};

export function playScene(scene: GameUI["scene"], context: GameContext, deltaTime: number) {
  const { gameState, gameDispatch, uiState, uiDispatch } = context;

  if (uiState.scene === "gameOver") return;

  if (gameState.units[gameState.heroId]?.isDead) {
    gameDispatch({ type: "stopUnits", units: gameState.getAliveEnemiesArray() });
    uiDispatch({ type: "setScene", scene: "gameOver" });

    return;
  }

  uiDispatch({ type: "processKeyPress", gameState });

  scenes[scene].apply(context, [deltaTime]);
}
