import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { constants } from "../../constants";

export function Tab(props: {
  children: React.ReactNode;
  id: string;
  value: string;
  title: string;
  active: boolean;
  disabled: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { gameState } = useGameState();

  const activeClass = props.active ? "active" : "";

  return (
    <div className={["ui-button", activeClass].join(" ")} key={props.value}>
      <label className="ui-radio" htmlFor={props.id} title={props.title}>
        <input
          type={"radio"}
          name={"editor-mode"}
          id={props.id}
          value={props.value}
          checked={props.active}
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            gameState.playSfx([constants.sfx.ui.tab]);

            props.onSelect(e);
          }}
        />
        <div className={"label"}>
          <span>{props.children}</span>
        </div>
      </label>
    </div>
  );
}
