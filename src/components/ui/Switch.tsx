import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Switch(props: {
  title: string;
  icon?: IconDefinition;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="ui-switch" title={props.title}>
      <input
        disabled={props.disabled ? true : undefined}
        className="toggle-checkbox"
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <div className="toggle-switch"></div>
      <span className="toggle-label">{props.icon ? <FontAwesomeIcon icon={props.icon} /> : props.title}</span>
    </label>
  );
}
