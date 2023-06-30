import React from "react";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";

import { FPSMeter } from "./FPS";
import { constants } from "../../constants";

export const DebugInfo = React.memo(function DebugInfo() {
  const { gameState, uiState } = useGameState();

  const { hero } = useHero();

  return gameState.debug.enabled ? (
    <div className={"debug"}>
      <table>
        <tbody>
          <tr>
            <th>Rect:</th>
            <td>{JSON.stringify(uiState.rect)}</td>
          </tr>

          <tr>
            <th>Viewport:</th>
            <td>{JSON.stringify(uiState.viewport)}</td>
          </tr>

          <tr>
            <th>Scroll:</th>
            <td>
              {JSON.stringify(uiState.isScrolling())} {JSON.stringify(uiState.scroll)}
            </td>
          </tr>

          <tr>
            <th>Hero position:</th>
            <td>
              {JSON.stringify(hero.position)} / {JSON.stringify(hero.screenPosition)}
            </td>
          </tr>

          <tr>
            <th>Scene:</th>
            <td>{JSON.stringify(uiState.scene)}</td>
          </tr>

          <tr>
            <th>FPS:</th>
            <td>
              <FPSMeter height={14} systemFps={constants.FPS} />
            </td>
          </tr>

          <tr>
            <th>OffscreenCanvas:</th>
            <td>
              Lights and shadows:
              {uiState.offscreenCanvasRenderingProgress.lightsAndShadows.percent}% (
              {uiState.offscreenCanvasRenderingProgress.lightsAndShadows.time}ms)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;
});
