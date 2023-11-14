import { GameScene, GameUI } from "@src/context/GameUIContext";
import { combatScene } from "@src/engine/_scenes/combat/combat";
import { debugSettingsScene } from "@src/engine/_scenes/debugSettingsScene";
import { editorScene } from "@src/engine/_scenes/editor";
import { gameScene } from "@src/engine/_scenes/game";
import { gameOverScene } from "@src/engine/_scenes/gameOver";
import { unitCharacteristicsScene } from "@src/engine/_scenes/heroCreation";
import { introScene } from "@src/engine/_scenes/intro";
import { inventoryScene } from "@src/engine/_scenes/inventory";
import { inventoryTransferScene } from "@src/engine/_scenes/inventoryTransfer";
import { loadingScene } from "@src/engine/_scenes/loading";
import { mainMenuScene } from "@src/engine/_scenes/mainMenu";
import { pauseScene } from "@src/engine/_scenes/pause";
import { settingsScene } from "@src/engine/_scenes/settings";
import { GameContext } from "@src/hooks/useGameState";

type SceneRunnerFunc = (this: GameContext, deltaTime: number) => void;

const scenes: { [sceneName in GameScene]: SceneRunnerFunc } = {
  intro: introScene,
  loading: loadingScene,
  mainMenu: mainMenuScene,
  unitCharacteristics: unitCharacteristicsScene,
  game: gameScene,
  pause: pauseScene,
  settings: settingsScene,
  combat: combatScene,
  inventory: inventoryScene,
  inventoryTransfer: inventoryTransferScene,
  editor: editorScene,
  gameOver: gameOverScene,
  debugSetting: debugSettingsScene,
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
