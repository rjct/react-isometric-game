import React from "react";

import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";
import { DebugMapSwitcher } from "../debug/DebugMapSwitcher";
import { DebugMapInfo } from "../debug/DebugMapInfo";
import { DebugInfo } from "../debug/DebugInfo";

export const Top = React.memo(function Top() {
  const { uiDispatch, gameState, uiState, gameDispatch } = useGameState();
  const { hero } = useHero();

  return (
    <div className={"top-wrapper"}>
      <div className={"block top"}>
        <div className={"title"}>
          <Switch
            title={"Debug"}
            checked={gameState.debug.enabled}
            onChange={(e) => {
              gameDispatch({ type: "toggleDebug", debugEnabled: e.target.checked });
            }}
          />
          {gameState.debug.enabled ? (
            <>
              <DebugMapSwitcher />
              <DebugMapInfo />
            </>
          ) : null}
        </div>

        <div className={"value"}>
          <Switch
            title={"Editor"}
            checked={uiState.scene === "editor"}
            onChange={(e) => {
              const scene = e.target.checked ? "editor" : "game";

              uiDispatch({ type: "setScene", scene });
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

      <DebugInfo />
    </div>
  );
});
