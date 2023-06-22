import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorModes } from "../../context/GameUIContext";

export function DebugMapInfo() {
  const { gameState } = useGameState();
  const mapStat = () => {
    return Object.entries({
      ...EditorModes,
    }).map(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entity = gameState[key];

      const count = Array.isArray(entity) ? entity.length : Object.keys(entity).length;

      return (
        <span className={"debug-label"} key={key} title={value.text}>
          <span className={"debug-label-title"}>
            <FontAwesomeIcon icon={value.icon} />
          </span>
          <label className={"debug-label-value"}>{count}</label>
        </span>
      );
    });
  };

  return <span>{mapStat()}</span>;
}
