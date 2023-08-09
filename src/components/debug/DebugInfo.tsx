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
            <th>Hero position:</th>
            <td>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Grid</span>
                <label className={"debug-label-value"}>
                  {hero.position.x.toFixed(2)} x {hero.position.y.toFixed(2)}
                </label>
              </span>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Screen</span>
                <label className={"debug-label-value"}>
                  {hero.screenPosition.screen.x.toFixed(2)} x {hero.screenPosition.screen.y.toFixed(2)}
                </label>
              </span>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Screen iso</span>
                <label className={"debug-label-value"}>
                  {hero.screenPosition.iso.x.toFixed(2)} x {hero.screenPosition.iso.y.toFixed(2)}
                </label>
              </span>
            </td>
          </tr>

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
            <th>Scene:</th>
            <td>{JSON.stringify(uiState.scene)}</td>
          </tr>

          <tr>
            <th>FPS:</th>
            <td>
              <FPSMeter height={14} systemFps={constants.FPS} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;
});
