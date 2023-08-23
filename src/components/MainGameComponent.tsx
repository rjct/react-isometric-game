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
import { loadMap } from "../engine/helpers";
import { GameOver } from "./GameOver";
import { usePreloadAssets } from "../hooks/usePreloadAssets";
import { Loading } from "./Loading";
import { EditorSidebar } from "./editor/EditorSidebar";
import { EntitiesLibrary } from "./editor/EntitiesLibrary";
import { DebugFeaturesSwitches } from "./debug/DebugFeaturesSwitches";
import { useUrl } from "../hooks/useUrl";
import { MiniMap } from "./map/MiniMap";
import { playScene } from "../engine/scenes/_scenes";

export const MainGameComponent = React.memo(function MainGameComponent() {
  const gameUIContext = React.useContext(GameUIContext);
  const [uiState, uiDispatch] = React.useReducer(UIReducer, gameUIContext);

  const gameContext = React.useContext(GameStateContext);
  const [gameState, gameDispatch] = React.useReducer(reducer, gameContext);

  const setScrollRef = React.useRef<MapForwardedRefs>({} as unknown as MapForwardedRefs);

  const { preloadAssets, loadingState } = usePreloadAssets();
  const { updateUrlWithFeaturesEnabled } = useUrl();

  uiState.setScroll = setScrollRef.current.setScroll;

  const mainLoop = (deltaTime: number) => {
    playScene(
      uiState.scene,
      {
        gameState,
        gameDispatch,
        uiState,
        uiDispatch,
      },
      deltaTime,
    );
  };

  useAnimationFrame(mainLoop, !loadingState.loading);

  React.useEffect(() => {
    uiDispatch({ type: "setScene", scene: "loading" });

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
    uiDispatch({ type: "setScene", scene: "loading" });

    preloadAssets(gameState).then((mediaAssets) => {
      loadMap(gameState.mapUrl).then((map) => {
        gameDispatch({ type: "switchMap", map, mediaFiles: mediaAssets });
        uiDispatch({ type: "setScene", scene: "game" });
      });
    });
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    uiDispatch({ type: "resetMousePosition" });

    if (uiState.scene === "editor") {
      gameState.getAllAliveUnitsArray().forEach((unit) => {
        unit.stop();
      });
    }
  }, [uiState.scene]);

  React.useEffect(() => {
    updateUrlWithFeaturesEnabled(gameState);
  }, [JSON.stringify(gameState.settings.featureEnabled), JSON.stringify(gameState.debug.featureEnabled)]);

  return (
    <div
      className="app-wrapper"
      data-scene={uiState.scene}
      data-debug-active={gameState.debug.enabled || null}
      data-editing-active={uiState.scene === "editor" || null}
      data-editor-mode={uiState.scene === "editor" ? uiState.editorMode : null}
    >
      <GameUiDispatchContext.Provider value={uiDispatch}>
        <GameUIContext.Provider value={uiState}>
          <GameDispatchContext.Provider value={gameDispatch}>
            <GameStateContext.Provider value={gameState}>
              <Loading assets={loadingState} />

              <GameOver />
              <Top />
              <div className={"center"}>
                <EntitiesLibrary />
                <DebugFeaturesSwitches />
                <MiniMap />
                <Map ref={setScrollRef} />
                <EditorSidebar />
              </div>
              <ControlPanel />
              <Inventory />
            </GameStateContext.Provider>
          </GameDispatchContext.Provider>
        </GameUIContext.Provider>
      </GameUiDispatchContext.Provider>
    </div>
  );
});
