import { constants } from "@src/constants";
import { GameUI } from "@src/context/GameUIContext";

export type CenterMapOnHeroUIReducerAction = {
  type: "centerMapOnHero";
  unitCoordinates: GridCoordinates;
};

export function centerMapOnHero(state: GameUI, action: CenterMapOnHeroUIReducerAction): GameUI {
  const { x1, y1, x2, y2 } = state.viewport.screen;

  state.setScroll({
    x: action.unitCoordinates.x - (x2 - x1) / 2 + constants.tileSize.width / 2,
    y: action.unitCoordinates.y - (y2 - y1) / 2,
  });

  return { ...state };
}
