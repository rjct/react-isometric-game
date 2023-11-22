import { GameMap } from "@src/engine/gameMap";

export type DeleteMessageReducerAction = {
  type: "deleteMessage";
  id: string;
};

export function deleteMessage(state: GameMap, action: DeleteMessageReducerAction): GameMap {
  const idx = state.messages.findIndex((message) => message.id === action.id);

  state.messages.splice(idx, 1);

  return { ...state };
}
