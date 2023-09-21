import { GameScene, GameUI } from "@src/context/GameUIContext";
import { combatScene } from "@src/engine/scenes/combat/combat";
import { editorScene } from "@src/engine/scenes/editor";
import { gameScene } from "@src/engine/scenes/game";
import { gameOverScene } from "@src/engine/scenes/gameOver";
import { introScene } from "@src/engine/scenes/intro";
import { inventoryScene } from "@src/engine/scenes/inventory";
import { loadingScene } from "@src/engine/scenes/loading";
import { mainMenuScene } from "@src/engine/scenes/mainMenu";
import { GameContext } from "@src/hooks/useGameState";

type SceneRunnerFunc = (this: GameContext, deltaTime: number) => void;

const scenes: { [sceneName in GameScene]: SceneRunnerFunc } = {
  intro: introScene,
  loading: loadingScene,
  mainMenu: mainMenuScene,
  game: gameScene,
  combat: combatScene,
  inventory: inventoryScene,
  editor: editorScene,
  gameOver: gameOverScene,
};

export function playScene(scene: GameUI["scene"], context: GameContext, deltaTime: number) {
  const { terrainState, gameState, gameDispatch, uiState, uiDispatch } = context;

  if (uiState.scene === "gameOver") return;
  if (uiState.scene === "mainMenu") return;

  if (gameState.units[gameState.heroId]?.isDead) {
    gameDispatch({ type: "stopUnits", units: gameState.getAliveEnemiesArray() });
    uiDispatch({ type: "setScene", scene: "gameOver" });

    return;
  }

  uiDispatch({ type: "processKeyPress", gameState, terrainState });

  scenes[scene].apply(context, [deltaTime]);
}
