import { GameMap } from "@src/engine/GameMap";

export type UpdateMapUrlReducerAction = {
  type: "updateMapUrl";
  mapUrl: GameMap["mapUrl"];
};

export function updateMapUrl(state: GameMap, action: UpdateMapUrlReducerAction): GameMap {
  return { ...state, ...{ mapUrl: action.mapUrl } };
}
