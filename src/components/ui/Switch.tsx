import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { constants } from "@src/engine/constants";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function Switch(props: {
  title?: string;
  icon?: IconDefinition;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { gameState } = useGameState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameState.playSfx([constants.sfx.ui.switch]);

    props.onChange(e);
  };

  return (
    <label className="ui-switch" title={props.title}>
      <input
        disabled={props.disabled ? true : undefined}
        className="toggle-checkbox"
        type="checkbox"
        checked={props.checked}
        onChange={handleChange}
      />
      <div className="toggle-switch"></div>

      {props.title || props.icon ? (
        <span className="toggle-label">{props.icon ? <FontAwesomeIcon icon={props.icon} /> : props.title}</span>
      ) : null}
    </label>
  );
}
