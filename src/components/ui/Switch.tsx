import React from "react";

export function Switch(props: {
  title: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="ui-switch">
      <input className="toggle-checkbox" type="checkbox" checked={props.checked} onChange={props.onChange} />
      <div className="toggle-switch"></div>
      <span className="toggle-label">{props.title}</span>
    </label>
  );
}
