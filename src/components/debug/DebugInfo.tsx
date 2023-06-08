import React from "react";
import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";

export const DebugInfo = React.memo(function DebugInfo() {
  const { gameState, uiState } = useGameState();

  const { hero } = useHero();

  const screenPosition = gameState.gridToScreenSpace(hero.position);

  return gameState.debug.enabled ? (
    <div
      className={"debug"}
      style={{
        top: uiState.rect.top,
      }}
    >
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
              {JSON.stringify(hero.position)} / {JSON.stringify(screenPosition)}
            </td>
          </tr>

          <tr>
            <th>Scene:</th>
            <td>{JSON.stringify(uiState.scene)}</td>
          </tr>
        </tbody>
      </table>
      {JSON.stringify(uiState.keys)}
    </div>
  ) : null;
});
