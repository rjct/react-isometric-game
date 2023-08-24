import { gameScene } from "./game";
import { GameScene, GameUI } from "../../context/GameUIContext";
import { GameContext } from "../../hooks/useGameState";
import { inventoryScene } from "./inventory";
import { loadingScene } from "./loading";

import { editorScene } from "./editor";
import { combatScene } from "./combat/combat";
import { gameOverScene } from "./gameOver";
import { mainMenuScene } from "./mainMenu";
import { introScene } from "./intro";

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
  const { gameState, gameDispatch, uiState, uiDispatch } = context;

  if (uiState.scene === "gameOver") return;
  if (uiState.scene === "mainMenu") return;

  if (gameState.units[gameState.heroId]?.isDead) {
    gameDispatch({ type: "stopUnits", units: gameState.getAliveEnemiesArray() });
    uiDispatch({ type: "setScene", scene: "gameOver" });

    return;
  }

  uiDispatch({ type: "processKeyPress", gameState });

  scenes[scene].apply(context, [deltaTime]);
}
