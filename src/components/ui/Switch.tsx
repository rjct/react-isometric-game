import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGameState } from "../../hooks/useGameState";
import { constants } from "../../constants";

export function Switch(props: {
  title: string;
  icon?: IconDefinition;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { gameState } = useGameState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gameState.playSfx([constants.sfx.ui.switch], 1);

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
      <span className="toggle-label">{props.icon ? <FontAwesomeIcon icon={props.icon} /> : props.title}</span>
    </label>
  );
}
