import { constants } from "@src/constants";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function Button(props: {
  children: React.ReactNode;
  title?: string;
  className?: string[];
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  vertical?: boolean;
}) {
  const { gameState } = useGameState();

  const handleClick = () => {
    if (props.disabled) return;

    gameState.playSfx([constants.sfx.ui.button]);
    props.onClick?.();
  };

  return (
    <div
      title={props.title}
      className={[
        ...[
          "ui-button",
          props.vertical ? "vertical" : null,
          props.disabled ? "disabled" : null,
          props.active ? "active" : null,
        ],
        ...(props.className || []),
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
}
