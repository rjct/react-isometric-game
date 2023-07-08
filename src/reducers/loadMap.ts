import { GameMap } from "../engine/GameMap";
import { mapsList } from "../maps_list";

export type LoadMapReducerAction = {
  type: "loadMap";
  mapUrl: mapsList;
};

export function loadMap(state: GameMap, action: LoadMapReducerAction) {
  return { ...state, ...{ mapUrl: action.mapUrl } };
}
