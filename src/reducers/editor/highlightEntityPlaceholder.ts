import { GameMap } from "@src/engine/gameMap";

export interface HighlightEntityPlaceholderReducerAction {
  type: "highlightEntityPlaceholder";
  position: GridCoordinates;
  rotation: AngleInDegrees;
  size: Size3D;
}

export function highlightEntityPlaceholder(state: GameMap, action: HighlightEntityPlaceholderReducerAction): GameMap {
  if (
    state.entityPlaceholder?.position.x === action.position.x &&
    state.entityPlaceholder?.position.y === action.position.y &&
    state.entityPlaceholder?.rotation === action.rotation
  ) {
    return state;
  }

  return {
    ...state,
    ...{
      entityPlaceholder: {
        position: action.position,
        rotation: action.rotation,
        size: action.size,
      },
    },
  };
}
