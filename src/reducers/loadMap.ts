import { GameMap } from "../engine/GameMap";

export type LoadMapReducerAction = {
  type: "loadMap";
  mapUrl: string;
};

export function loadMap(state: GameMap, action: LoadMapReducerAction) {
  return { ...state, ...{ mapUrl: action.mapUrl } };
}
