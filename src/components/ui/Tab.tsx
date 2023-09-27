import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameState.playSfx([constants.sfx.ui.tab]);

    props.onSelect(e);
  };

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
          onChange={handleChange}
        />
        <div className={"label"}>
          <span>{props.children}</span>
        </div>
      </label>
    </div>
  );
}
