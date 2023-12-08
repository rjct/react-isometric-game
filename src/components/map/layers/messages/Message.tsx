import { constants } from "@src/engine/constants";
import { gridToScreenSpace } from "@src/engine/helpers";
import { Message } from "@src/engine/MessageFactory";
import { useGameState } from "@src/hooks/useGameState";

export const MessageComponent = (props: { message: Message }) => {
  const { message } = props;
  const { gameState } = useGameState();

  const position = message.type === "tooltip" ? gridToScreenSpace(message.position!, gameState.mapSize) : undefined;

  return (
    <div
      key={message.id}
      className={["message", message.style].join(" ")}
      data-type={message.type}
      data-show-style={message.showStyle}
      style={{
        left: position ? position.x + constants.tileSize.width / 2 : undefined,
        top: position ? position.y + constants.tileSize.height / 2 : undefined,
        transform: position ? "translate(-50%, 0)" : undefined,
      }}
      onClick={() => message.onClick()}
    >
      {message.value}
    </div>
  );
};
