import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorModes } from "../../context/GameUIContext";
import { Building } from "../../engine/BuildingFactory";
import { Unit } from "../../engine/UnitFactory";
import { TerrainArea } from "../../engine/TerrainAreaFactory";
import { Light } from "../../engine/LightFactory";

export const DebugMapInfo = React.memo(() => {
  const { gameState, uiState } = useGameState();

  const mapStat = () => {
    return Object.entries({
      ...EditorModes,
    }).map(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entities = Array.isArray(gameState[key]) ? gameState[key] : Object.values(gameState[key]);

      const count = entities.length;
      const visibleCount = (entities as Array<Building | Unit | TerrainArea | Light>).filter((entity) =>
        entity instanceof Building || entity instanceof Unit
          ? gameState.isEntityVisible(entity) && gameState.isEntityInViewport(entity, uiState.viewport)
          : true
      ).length;

      return (
        <span className={"debug-label"} key={key} title={`${value.text} (visible / total)`}>
          <span className={"debug-label-title"}>
            <FontAwesomeIcon icon={value.icon} />
          </span>
          <label className={"debug-label-value"}>
            {visibleCount} / {count}
          </label>
        </span>
      );
    });
  };

  return <span>{mapStat()}</span>;
});
