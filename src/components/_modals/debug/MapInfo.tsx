import { DebugMapSelector } from "@src/components/_modals/debug/DebugMapSelector";
import { EditingModeButton } from "@src/components/_modals/debug/EditingModeButton";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const MapInfo = React.memo(() => {
  const { gameState, terrainState } = useGameState();

  return (
    <fieldset className={"game-map"} data-editable={true}>
      <legend className={"outlined"}>Current map: {gameState.mapUrl}</legend>
      <div className={"header"}>
        <DebugMapSelector />
        <EditingModeButton />
      </div>

      <div className={"body"}>
        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Units</div>
            <div className={"stat-value-wrapper"}>{gameState.getAllUnitsArray().length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>&nbsp;&nbsp;Alive</div>
            <div className={"stat-value-wrapper"}>{gameState.getAllAliveUnitsArray().length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>&nbsp;&nbsp;Dead</div>
            <div className={"stat-value-wrapper"}>
              {gameState.getAllUnitsArray().length - gameState.getAllAliveUnitsArray().length}
            </div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Buildings</div>
            <div className={"stat-value-wrapper"}>{gameState.buildings.length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Vehicles</div>
            <div className={"stat-value-wrapper"}>{gameState.vehicles.length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Lights</div>
            <div className={"stat-value-wrapper"}>{gameState.lights.length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Weapon</div>
            <div className={"stat-value-wrapper"}>{Object.keys(gameState.weapon).length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Ammo</div>
            <div className={"stat-value-wrapper"}>{Object.keys(gameState.ammo).length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>Terrain</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>&nbsp;&nbsp;Areas</div>
            <div className={"stat-value-wrapper"}>{terrainState.areas.length}</div>
          </div>
        </div>

        <div className={"list-row"}>
          <div className={"list-row-body"}>
            <div className={"stat-title"}>&nbsp;&nbsp;Clusters</div>
            <div className={"stat-value-wrapper"}>{terrainState.clusters.length}</div>
          </div>
        </div>
      </div>

      <div className={"footer"}>
        Map size: {gameState.mapSize.width}x{gameState.mapSize.height}
      </div>
    </fieldset>
  );
});
