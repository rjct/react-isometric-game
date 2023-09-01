import { GameMap } from "@src/engine/GameMap";
import { mapsList } from "@src/maps_list";

export type LoadMapReducerAction = {
  type: "loadMap";
  mapUrl: mapsList;
};

export function loadMap(state: GameMap, action: LoadMapReducerAction) {
  return { ...state, ...{ mapUrl: action.mapUrl } };
}
