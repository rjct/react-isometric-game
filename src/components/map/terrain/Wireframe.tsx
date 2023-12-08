import { WireframeEntityPlaceholder } from "@src/components/map/terrain/WireframeEntityPlaceholder";
import { WireframeMarker } from "@src/components/map/terrain/WireframeMarker";
import { MapLayer } from "@src/components/map/_shared/MapLayer";
import { constants } from "@src/engine/constants";

import { WireframeTooltip } from "@src/components/map/terrain/WireframeTooltip";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useMousePosition } from "@src/hooks/useMousePosition";
import React from "react";

export const Wireframe = React.memo(function WireframeTiles() {
  const { gameState } = useGameState();
  const { getEditorLibraryPosition } = useEditor();
  const { markerPosition, markerClassName, tooltipValue } = useMousePosition();

  return (
    <>
      <WireframeTooltip
        key={markerClassName.join("")}
        coordinates={markerPosition}
        className={markerClassName}
        value={tooltipValue}
      />

      <div
        className={"wireframe-wrapper"}
        data-entity-selected-for-inventory-transfer={!!gameState.selectedEntityForInventoryTransfer || null}
        style={{
          width: gameState.mapSize.width * constants.tileSize.width + getEditorLibraryPosition(),
          height: gameState.mapSize.height * constants.tileSize.height,
        }}
      >
        <MapLayer
          isometric={true}
          size={gameState.mapSize}
          className={"wireframe"}
          dataProps={{
            "data-wireframe-active": gameState.debug.enabled && gameState.debug.featureEnabled.wireframe,
          }}
        >
          <WireframeMarker
            coordinates={markerPosition}
            className={markerClassName}
            value={""}
            onAnimationComplete={() => {
              // const classes = [...markerClassName];
              // classes.pop();
              //
              // setMarkerClassName(classes);
            }}
          />

          <WireframeEntityPlaceholder />
        </MapLayer>
      </div>
    </>
  );
});
