import { GameMap } from "@src/engine/gameMap";
import { mapsList } from "@src/engine/maps_list";

export type LoadMapReducerAction = {
  type: "loadMap";
  mapUrl: mapsList;
};

export function loadMap(state: GameMap, action: LoadMapReducerAction) {
  return { ...state, ...{ mapUrl: action.mapUrl } };
}
