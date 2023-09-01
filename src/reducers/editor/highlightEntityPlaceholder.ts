import { GameMap } from "@src/engine/GameMap";

export interface HighlightEntityPlaceholderReducerAction {
  type: "highlightEntityPlaceholder";
  position: GridCoordinates;
  direction: Direction;
  size: Size3D;
}

export function highlightEntityPlaceholder(state: GameMap, action: HighlightEntityPlaceholderReducerAction): GameMap {
  if (
    state.entityPlaceholder?.position.x === action.position.x &&
    state.entityPlaceholder?.position.y === action.position.y &&
    state.entityPlaceholder?.direction === action.direction
  ) {
    return state;
  }

  return {
    ...state,
    ...{
      entityPlaceholder: {
        position: action.position,
        direction: action.direction,
        size: action.size,
      },
    },
  };
}
