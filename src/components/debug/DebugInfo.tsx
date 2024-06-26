import { FPSMeter } from "@src/components/debug/FPS";
import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import React from "react";

export const DebugInfo = React.memo(function DebugInfo() {
  const { gameState, uiState } = useGameState();
  const { hero } = useHero();

  if (!gameState.debug.enabled) return null;

  return (
    <div className={"debug"}>
      <table>
        <tbody>
          <tr>
            <th>Hero position:</th>
            <td>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Grid</span>
                <label className={"debug-label-value"}>
                  {hero.position.grid.x.toFixed(2)} x {hero.position.grid.y.toFixed(2)}
                </label>
              </span>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Screen</span>
                <label className={"debug-label-value"}>
                  {hero.position.screen.x.toFixed(2)} x {hero.position.screen.y.toFixed(2)}
                </label>
              </span>
              <span className={"debug-label"}>
                <span className={"debug-label-title"}>Screen iso</span>
                <label className={"debug-label-value"}>
                  {hero.position.iso.x.toFixed(2)} x {hero.position.iso.y.toFixed(2)}
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
            <td>{JSON.stringify(uiState.viewport.screen)}</td>
          </tr>

          <tr>
            <th>Scroll:</th>
            <td>{JSON.stringify(uiState.scroll)}</td>
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
  );
});
