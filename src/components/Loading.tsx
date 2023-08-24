import React from "react";
import { useGameState } from "../hooks/useGameState";
import { FullscreenPanel } from "./ui/FullscreenPanel";

export const Loading = React.memo((props: { assets: { loading: boolean; loaded: number; total: number } }) => {
  const { uiState } = useGameState();

  const assetsLoadedPercent = Math.round((props.assets.loaded / props.assets.total) * 100);

  return uiState.scene === "loading" ? (
    <FullscreenPanel overlay={true}>
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
    </FullscreenPanel>
  ) : null;
});
