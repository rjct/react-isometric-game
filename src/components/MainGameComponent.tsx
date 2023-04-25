import React from "react";
import { GameDispatchContext } from "../context/GameDispachContext";
import { GameStateContext } from "../context/GameStateContext";
import { Map } from "./map/Map";

import { Top } from "./top/Top";
import { reducer } from "../reducers/_reducers";
import { GameUIContext } from "../context/GameUIContext";
import { ControlPanel } from "./control_panel/ControlPanel";
import { UIReducer } from "../reducers/ui/_reducers";
import { GameUiDispatchContext } from "../context/GameUIDispatchContext";
import { Inventory } from "./inventory/Inventory";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { Debug } from "./Debug";
import { loadMap, randomInt } from "../engine/helpers";
import { GameOver } from "./GameOver";
import { usePreloadAssets } from "../hooks/usePreloadAssets";
import { Loading } from "./Loading";

export const MainGameComponent = React.memo(function MainGameComponent() {
  const gameUIContext = React.useContext(GameUIContext);
  const [uiState, uiDispatch] = React.useReducer(UIReducer, gameUIContext);

  const gameContext = React.useContext(GameStateContext);
  const [gameState, gameDispatch] = React.useReducer(reducer, gameContext);

  const setScrollRef = React.useRef(() => null);

  const { preloadAssets, loadingState } = usePreloadAssets();

  uiState.setScroll = setScrollRef.current;

  const mainLoop = (deltaTime: number) => {
    if (gameState.units[gameState.heroId].isDead) {
      gameState.getAliveEnemiesArray().forEach((unit) => unit.setAction("none"));
      uiDispatch({ type: "setScene", scene: "game-over" });

      return;
    }

    uiDispatch({ type: "processKeyPress", scene: uiState.scene });

    switch (uiState.scene) {
      case "game":
        // User Input
        uiDispatch({ type: "scrollMapOnScreenEdges", deltaTime });

        // Update

        gameState.getAllAliveUnitsArray().forEach((unit) => {
          gameDispatch({ type: "animateUnitMove", unit, deltaTime });
          gameDispatch({ type: "animateFiredAmmo", unit, deltaTime });
          gameDispatch({ type: "detectFiredAmmoHitsTarget", unit });
          gameDispatch({ type: "cleanupFiredAmmo", unit });
          gameDispatch({ type: "detectHeroOnExitPoints", unit });
        });

        gameState.getAliveEnemiesArray().forEach((unit) => {
          const randomActions = ["roam", "idle"];
          const randomAction = randomActions[randomInt(0, randomActions.length - 1)];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          unit[randomAction](gameState);
          unit.cooldown(deltaTime);
        });
        break;

      case "inventory":
        //console.log("Inv scene");
        break;
    }
  };

  useAnimationFrame(mainLoop, !loadingState.loading);

  React.useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      uiDispatch({ type: "detectKeyPress", keyCode: e.code, keyPressState: true });
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      uiDispatch({ type: "detectKeyPress", keyCode: e.code, keyPressState: false });
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  React.useEffect(() => {
    loadMap(gameState.mapUrl).then((map) => gameDispatch({ type: "switchMap", map }));
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    preloadAssets();
  }, []);

  return (
    <div className="app-wrapper">
      <GameUiDispatchContext.Provider value={uiDispatch}>
        <GameUIContext.Provider value={uiState}>
          <GameDispatchContext.Provider value={gameDispatch}>
            <GameStateContext.Provider value={gameState}>
              {loadingState.loading ? <Loading {...loadingState} /> : null}
              <GameOver />
              <Top />
              <Debug />
              <Map ref={setScrollRef} />
              <ControlPanel />

              <Inventory />
            </GameStateContext.Provider>
          </GameDispatchContext.Provider>
        </GameUIContext.Provider>
      </GameUiDispatchContext.Provider>
    </div>
  );
});
