import React from "react";
import { useGameState } from "../hooks/useGameState";

export const Loading = React.memo((props: { assets: { loading: boolean; loaded: number; total: number } }) => {
  const { uiState } = useGameState();

  const assetsLoadedPercent = Math.round((props.assets.loaded / props.assets.total) * 100);

  return uiState.scene === "loading" ? (
    <div className={"loading with-overlay"}>
      <fieldset className={"loading-info"}>
        <legend>Wait</legend>

        <div className={"entity-progress-wrapper"}>
          <div className={"label"}>Loading assets</div>
          <div className={"value"}>
            <progress max={props.assets.total} value={props.assets.loaded} />
          </div>
          <div className={"value"}>{isNaN(assetsLoadedPercent) ? 0 : assetsLoadedPercent}%</div>
        </div>
      </fieldset>
    </div>
  ) : null;
});
