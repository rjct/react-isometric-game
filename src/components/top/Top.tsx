import React from "react";

import { useHero } from "../../hooks/useHero";
import { useGameState } from "../../hooks/useGameState";
import { Switch } from "../ui/Switch";
import { DebugMapSwitcher } from "../debug/DebugMapSwitcher";
import { DebugMapInfo } from "../debug/DebugMapInfo";
import { DebugInfo } from "../debug/DebugInfo";
import { HeroPoints } from "./HeroPoints";

export const Top = React.memo(function Top() {
  const { uiDispatch, gameState, uiState, gameDispatch } = useGameState();
  const { hero } = useHero();

  return (
    <div className={"top-wrapper"}>
      <fieldset className={"block top"}>
        <legend>{gameState.mapUrl}</legend>
        <legend className={"short"}>{gameState.mapUrl.split("/")[1].split(".")[0]}</legend>
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
      </fieldset>

      <fieldset>
        <legend>Action points</legend>
        <legend className={"short"} title="Action points">
          AP
        </legend>
        <HeroPoints points={hero.actionPoints} />
      </fieldset>

      <fieldset>
        <legend>Health points</legend>
        <legend className={"short"} title="Health points">
          HP
        </legend>
        <HeroPoints points={hero.healthPoints} />
      </fieldset>

      <DebugInfo />
    </div>
  );
});
