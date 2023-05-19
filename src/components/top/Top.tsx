import React from "react";

import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";

export const Top = React.memo(function Top() {
  const { uiDispatch, gameState, uiState, gameDispatch } = useGameState();
  const { hero } = useHero();

  return (
    <div className={"top-wrapper"}>
      <div className={"block top"}>
        <div className={"title"}>
          {gameState.mapUrl} ({gameState.mapSize.width}x{gameState.mapSize.height})
        </div>

        <div className={"value"}>
          <label htmlFor={"debug"}>Debug</label>
          <input
            id={"debug"}
            type="checkbox"
            checked={gameState.debug}
            onChange={(e) => {
              gameDispatch({ type: "toggleDebug", debugEnabled: e.target.checked });
            }}
          />
        </div>

        <div className={"value"}>
          <label htmlFor={"editor"}>Editor</label>
          <input
            id={"editor"}
            type="checkbox"
            checked={uiState.scene === "editor"}
            onChange={(e) => {
              uiDispatch({ type: "setScene", scene: e.target.checked ? "editor" : "game" });
            }}
          />
        </div>
      </div>

      <div className={"block hp"} title="Health points">
        <div className={"title"}>HP</div>
        <div className={"value"}>
          {hero.healthPoints.current} / {hero.healthPoints.max}
        </div>
      </div>

      <div className={"block ap"} title="Action points">
        <div className={"title"}>AP</div>
        <div className={"value"}>
          {hero.actionPoints.current} / {hero.actionPoints.max}
        </div>
      </div>
    </div>
  );
});
