import { GameMap } from "@src/engine/gameMap";
import { Message, MessageFactoryProps } from "@src/engine/MessageFactory";

export type EmitMessageReducerAction = {
  type: "emitMessage";
  messageType: MessageFactoryProps["type"];
  messageStyle?: MessageFactoryProps["style"];
  messageShowStyle?: MessageFactoryProps["showStyle"];
  value: MessageFactoryProps["value"];
  position?: MessageFactoryProps["position"];
  timeToLiveMs?: MessageFactoryProps["timeToLiveMs"];
  onClick?: MessageFactoryProps["onClick"];
};

export function emitMessage(state: GameMap, action: EmitMessageReducerAction): GameMap {
  const { messageType, messageStyle, messageShowStyle, value, position, timeToLiveMs, onClick } = action;

  const message = new Message({
    type: messageType,
    style: messageStyle,
    showStyle: messageShowStyle,
    value,
    position,
    timeToLiveMs,
    onClick,
  });

  state.messages.push(message);

  return { ...state };
}
