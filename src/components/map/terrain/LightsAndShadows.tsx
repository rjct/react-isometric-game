import { MapLayer } from "@src/components/map/MapLayer";
import { constants } from "@src/engine/constants";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useLightsAndShadows } from "@src/hooks/useLightsAndShadows";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const LightsAndShadows = React.memo(() => {
  const { gameState, gameDispatch, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { checkEditorMode } = useEditor();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { renderShadows, renderLights } = useLightsAndShadows(gameState);

  const [shadowsImageSrc, setShadowsImageSrc] = React.useState("");
  const [lightsImageSrc, setLightsImageSrc] = React.useState("");

  const isAllowed =
    (gameState.mapSize.width > 0 && checkCurrentScene(["game", "combat", "inventory"])) ||
    (checkCurrentScene(["editor"]) && checkEditorMode(["lights"]));

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      renderShadows(ctx);
      setShadowsImageSrc(canvasRef.current.toDataURL());

      renderLights(ctx);
      setLightsImageSrc(canvasRef.current.toDataURL());
    }
  }, [
    gameState.mapSize,
    gameState.getLightsHash(),
    gameState.globalShadows,
    gameState.globalLights,
    gameState.settings.featureEnabled.light,
    gameState.settings.featureEnabled.shadow,
    gameState.settings.featureEnabled.unitShadow,
    gameState.getVehiclesHash(),
    uiState.scene,
    uiState.editorMode,
  ]);

  React.useEffect(() => {
    if (!isAllowed) return;

    gameDispatch({ type: "recalculateLightsAndShadows" });
  }, [gameState.getVehiclesHash()]);

  if (!isAllowed) return null;

  return (
    <MapLayer size={gameState.mapSize} className={"lights-and-shadows"}>
      <img
        alt={undefined}
        src={shadowsImageSrc}
        style={{
          width: gameState.mapSize.width * constants.wireframeTileSize.width,
          height: gameState.mapSize.height * constants.wireframeTileSize.height,
        }}
      ></img>
      <img
        alt={undefined}
        src={lightsImageSrc}
        style={{
          width: gameState.mapSize.width * constants.wireframeTileSize.width,
          height: gameState.mapSize.height * constants.wireframeTileSize.height,
        }}
      ></img>
      <canvas
        width={gameState.mapSize.width}
        height={gameState.mapSize.height}
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </MapLayer>
  );
});
