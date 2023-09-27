import { ControlPanel } from "@src/components/controlPanel/ControlPanel";
import { DebugFeaturesSwitches } from "@src/components/debug/DebugFeaturesSwitches";
import { EditorSidebar } from "@src/components/editor/EditorSidebar";
import { EntitiesLibrary } from "@src/components/editor/EntitiesLibrary";
import { GameOver } from "@src/components/GameOver";
import { Intro } from "@src/components/Intro";
import { Inventory } from "@src/components/inventory/Inventory";
import { Loading } from "@src/components/Loading";
import { MainMenu } from "@src/components/MainMenu";
import { MapComponent, MapForwardedRefs } from "@src/components/map/MapComponent";
import { MiniMap } from "@src/components/map/MiniMap";
import { TopPanel } from "@src/components/topPanel/TopPanel";
import { GameDispatchContext } from "@src/context/GameDispachContext";
import { GameStateContext } from "@src/context/GameStateContext";
import { GameTerrainContext } from "@src/context/GameTerrainContext";
import { GameUIContext } from "@src/context/GameUIContext";
import { GameUiDispatchContext } from "@src/context/GameUIDispatchContext";
import { GameTerrainDispatchContext } from "@src/context/GateTerrainDispatchContext";
import { loadMap } from "@src/engine/helpers";
import { playScene } from "@src/engine/_scenes/_scenes";
import { useAnimationFrame } from "@src/hooks/useAnimationFrame";
import { usePreloadAssets } from "@src/hooks/usePreloadAssets";
import { useUrl } from "@src/hooks/useUrl";
import { TerrainReducer } from "@src/reducers/terrain/_reducers";
import { UIReducer } from "@src/reducers/ui/_reducers";
import { reducer } from "@src/reducers/_reducers";
import React from "react";

export const MainGameComponent = React.memo(function MainGameComponent() {
  const gameTerrainContext = React.useContext(GameTerrainContext);
  const [terrainState, terrainDispatch] = React.useReducer(TerrainReducer, gameTerrainContext);

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
        terrainState,
        terrainDispatch,
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
    if (uiState.introSceneElapsedTime > 0) {
      loadMap(gameState.mapUrl).then((map) => {
        gameDispatch({ type: "switchMap", map, mediaFiles: gameState.mediaAssets });
        uiDispatch({ type: "setScene", scene: "game" });
      });

      return;
    }

    uiDispatch({ type: "setScene", scene: "loading" });

    preloadAssets(gameState).then((mediaAssets) => {
      loadMap(gameState.mapUrl).then((map) => {
        terrainDispatch({ type: "switchMap", map, mediaFiles: mediaAssets });
        gameDispatch({ type: "switchMap", map, mediaFiles: mediaAssets });
        uiDispatch({ type: "setScene", scene: gameState.debug.featureEnabled.skipIntro ? "game" : "intro" });
      });
    });
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    uiDispatch({ type: "resetMousePosition" });
    gameDispatch({ type: "clearEntityPlaceholder" });

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

              <Intro />
              <MainMenu />
              <GameOver />
              <TopPanel />

              <GameTerrainDispatchContext.Provider value={terrainDispatch}>
                <GameTerrainContext.Provider value={terrainState}>
                  <div className={"center"}>
                    <EntitiesLibrary />
                    <MiniMap />
                    <MapComponent ref={setScrollRef} />
                    <EditorSidebar />
                  </div>
                </GameTerrainContext.Provider>
              </GameTerrainDispatchContext.Provider>

              <DebugFeaturesSwitches />
              <ControlPanel />
              <Inventory />
            </GameStateContext.Provider>
          </GameDispatchContext.Provider>
        </GameUIContext.Provider>
      </GameUiDispatchContext.Provider>
    </div>
  );
});
