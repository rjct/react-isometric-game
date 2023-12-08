import { MessageComponent } from "@src/components/map/layers/messages/Message";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const MessagesSticky = React.memo(() => {
  const { gameState } = useGameState();

  return (
    <div className={"messages-layer messages-layer--sticky"}>
      {gameState.messages
        .filter((message) => message.type === "sticky")
        .map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
    </div>
  );
});
