import { FullscreenPanel } from "@src/components/ui/FullscreenPanel";
import { ProgressBar } from "@src/components/ui/ProgressBar";
import { AssetsLoadingState } from "@src/hooks/usePreloadAssets";
import { useScene } from "@src/hooks/useScene";
import { filesize } from "filesize";
import React from "react";

export const Loading = React.memo(
  (props: { assets: { loading: boolean; loaded: AssetsLoadingState; total: AssetsLoadingState } }) => {
    const { checkCurrentScene } = useScene();

    if (!checkCurrentScene(["loading"])) return null;

    return (
      <FullscreenPanel overlay={true} classNames={["loading"]}>
        <fieldset className={"loading-info"}>
          <legend>Loading</legend>

          <div className={"entity-progress-wrapper"}>
            <div className={"label"}>GFX</div>

            <div className={"value"}>
              {filesize(props.assets.loaded.image.size)} of {filesize(props.assets.total.image.size)}
            </div>
          </div>

          <div className={"entity-progress-wrapper"}>
            <div className={"label"}>SFX</div>

            <div className={"value"}>
              {filesize(props.assets.loaded.audio.size)} of {filesize(props.assets.total.audio.size)}
            </div>
          </div>

          <div className={"progress"}>
            <ProgressBar
              value={
                ((props.assets.loaded.image.count + props.assets.loaded.audio.count) * 100) /
                (props.assets.total.image.count + props.assets.total.audio.count)
              }
            />
          </div>
        </fieldset>
      </FullscreenPanel>
    );
  },
);
