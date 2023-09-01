import { constants } from "@src/constants";
import { GameUI } from "@src/context/GameUIContext";

export type ScrollMapOnScreenEdgesUIReducerAction = {
  type: "scrollMapOnScreenEdges";
  deltaTime: number;
};

export const scrollMapOnScreenEdges = (state: GameUI, action: ScrollMapOnScreenEdgesUIReducerAction): GameUI => {
  const shift = (action.deltaTime || 0) * constants.SCROLL_SPEED;
  const currentScroll = { ...state.scroll };

  const x = state.mousePosition.browser.x;
  const y = state.mousePosition.browser.y + state.viewport.y1;

  const edge = constants.SCROLL_EDGE_WIDTH;

  state.scrollDirection = "none";

  if (x === Infinity || y === Infinity) return state;

  switch (true) {
    // left
    case x <= edge:
      state.setScroll({ ...currentScroll, ...{ x: state.scroll.x - shift } });
      state.scrollDirection = "left";

      return { ...state };

    // top
    case y <= edge:
      state.setScroll({ ...currentScroll, ...{ y: state.scroll.y - shift } });
      state.scrollDirection = "top";

      return { ...state };

    // right
    case x > state.rect.width - edge:
      state.setScroll({ ...currentScroll, ...{ x: state.scroll.x + shift } });
      state.scrollDirection = "right";

      return { ...state };

    // bottom
    case y > state.rect.height - edge:
      state.setScroll({ ...currentScroll, ...{ y: state.scroll.y + shift } });
      state.scrollDirection = "bottom";

      return { ...state };
  }

  return state;
};
