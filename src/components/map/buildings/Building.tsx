import { BuildingType } from "../../../engine/BuildingFactory";
import React from "react";
import { getUnitZIndex } from "../../../engine/helpers";
import { useGameState } from "../../../hooks/useGameState";

export function Building(props: { building: BuildingType }) {
  const { gameState, uiState } = useGameState();

  const [viewport, setViewport] = React.useState(uiState.viewport);

  React.useEffect(() => {
    setViewport(uiState.viewport);
  }, [uiState.viewport]);

  const screenPosition = gameState.gridToScreenSpace(props.building.position);

  return gameState.isEntityInViewport(props.building, viewport) ? (
    <div
      className={props.building.className}
      style={{
        left: screenPosition.x, //props.building.position.screen.x,
        top: screenPosition.y, //props.building.position.screen.y,
        zIndex: getUnitZIndex(props.building),
      }}
    ></div>
  ) : null;
}
