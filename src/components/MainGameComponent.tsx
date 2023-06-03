import React from "react";
import { GameDispatchContext } from "../context/GameDispachContext";
import { GameStateContext } from "../context/GameStateContext";
import { Map, MapForwardedRefs } from "./map/Map";

import { Top } from "./top/Top";
import { reducer } from "../reducers/_reducers";
import { GameUIContext } from "../context/GameUIContext";
import { ControlPanel } from "./control_panel/ControlPanel";
import { UIReducer } from "../reducers/ui/_reducers";
import { GameUiDispatchContext } from "../context/GameUIDispatchContext";
import { Inventory } from "./inventory/Inventory";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { DebugInfo } from "./debug/DebugInfo";
import { loadMap, randomInt } from "../engine/helpers";
import { GameOver } from "./GameOver";
import { usePreloadAssets } from "../hooks/usePreloadAssets";
import { Loading } from "./Loading";
import { EditorSidebar } from "./editor/EditorSidebar";
import { EntitiesLibrary } from "./editor/EntitiesLibrary";

export const MainGameComponent = React.memo(function MainGameComponent() {
  const gameUIContext = React.useContext(GameUIContext);
  const [uiState, uiDispatch] = React.useReducer(UIReducer, gameUIContext);

  const gameContext = React.useContext(GameStateContext);
  const [gameState, gameDispatch] = React.useReducer(reducer, gameContext);

  const setScrollRef = React.useRef<MapForwardedRefs>({} as unknown as MapForwardedRefs);

  const { preloadAssets, loadingState } = usePreloadAssets();

  uiState.setScroll = setScrollRef.current.setScroll;

  const mainLoop = (deltaTime: number) => {
    if (gameState.units[gameState.heroId]?.isDead) {
      gameState.getAliveEnemiesArray().forEach((unit) => unit.stop());
      uiDispatch({ type: "setScene", scene: "game-over" });

      return;
    }

    uiDispatch({ type: "processKeyPress", gameState });

    switch (uiState.scene) {
      case "game":
        // User Input
        uiDispatch({ type: "scrollMapOnScreenEdges", deltaTime });

        gameDispatch({ type: "castShadows", deltaTime });

        // Update
        gameState.getAllAliveUnitsArray().forEach((unit) => {
          gameDispatch({ type: "animateUnitMove", unit, deltaTime });
          gameDispatch({ type: "detectHeroOnExitPoints", unit });

          const weapon = unit.getCurrentWeapon();

          gameDispatch({ type: "animateFiredAmmo", weapon, deltaTime });
          gameDispatch({ type: "detectFiredAmmoHitsTarget", weapon });
          gameDispatch({ type: "cleanupFiredAmmo", weapon });
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

      case "editor":
        gameState.getAllAliveUnitsArray().forEach((unit) => {
          unit.stop();
        });
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
    preloadAssets().then((mediaFiles) => {
      loadMap(gameState.mapUrl).then((map) => gameDispatch({ type: "switchMap", map, mediaFiles }));
    });
  }, [gameState.mapUrl]);

  return (
    <div className="app-wrapper">
      <GameUiDispatchContext.Provider value={uiDispatch}>
        <GameUIContext.Provider value={uiState}>
          <GameDispatchContext.Provider value={gameDispatch}>
            <GameStateContext.Provider value={gameState}>
              {loadingState.loading ? <Loading {...loadingState} /> : null}
              <GameOver />
              <Top />
              <DebugInfo />
              <div className={"center"}>
                <Map ref={setScrollRef} />
                <EditorSidebar />
              </div>
              <ControlPanel />

              <EntitiesLibrary />
              <Inventory />
            </GameStateContext.Provider>
          </GameDispatchContext.Provider>
        </GameUIContext.Provider>
      </GameUiDispatchContext.Provider>
    </div>
  );
});
