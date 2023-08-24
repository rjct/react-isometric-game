import React from "react";
import { constants } from "../../constants";
import { useGameState } from "../../hooks/useGameState";

export function Button(props: {
  children: React.ReactNode;
  title?: string;
  className?: string[];
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const { gameState } = useGameState();

  return (
    <div
      title={props.title}
      className={[
        ...["ui-button", "vertical", props.disabled ? "disabled" : null, props.active ? "active" : null],
        ...(props.className || []),
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        if (props.disabled) return;

        gameState.playSfx([constants.sfx.ui.button], 1);
        props.onClick?.();
      }}
    >
      {props.children}
    </div>
  );
}
