import { MessageComponent } from "@src/components/map/layers/messages/Message";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const MessagesTooltip = React.memo(() => {
  const { gameState } = useGameState();

  return (
    <>
      <div className={"messages-layer messages-layer--tooltip"}>
        {gameState.messages
          .filter((message) => message.type === "tooltip")
          .map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
      </div>
    </>
  );
});
