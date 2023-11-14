import React from "react";

export const GameLogo = React.memo(() => {
  return (
    <div className={"game-logo-wrapper"}>
      <div className={"game-logo"}></div>
    </div>
  );
});
