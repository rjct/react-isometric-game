import React from "react";
import { useGameState } from "../../../hooks/useGameState";
import { useLightsAndShadows } from "../../../hooks/useLightsAndShadows";
import { constants } from "../../../constants";
import { MapLayer } from "../MapLayer";
import { GameScene } from "../../../context/GameUIContext";

export const LightsAndShadows = React.memo(() => {
  const { gameState, uiState } = useGameState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

  const { renderShadows, renderLights } = useLightsAndShadows(gameState);

  const [shadowsImageSrc, setShadowsImageSrc] = React.useState("");
  const [lightsImageSrc, setLightsImageSrc] = React.useState("");

  const isAllowed =
    gameState.mapSize.width > 0 &&
    ((["game", "combat", "inventory"] as GameScene[]).includes(uiState.scene) ||
      (uiState.scene === "editor" && uiState.editorMode === "lights"));

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
    uiState.scene === "editor" ? gameState.getLightsHash() : false,
    gameState.globalShadows,
    gameState.globalLights,
    gameState.settings.featureEnabled.light,
    gameState.settings.featureEnabled.shadow,
    gameState.settings.featureEnabled.unitShadow,
    uiState.scene,
    uiState.editorMode,
  ]);

  return isAllowed ? (
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
  ) : null;
});
