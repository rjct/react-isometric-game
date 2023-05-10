import React from "react";

export function Button(props: {
  children: React.ReactNode;
  title?: string;
  className?: string[];
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <div
      title={props.title}
      className={[
        ...["ui-button", "vertical", props.disabled ? "disabled" : null, props.active ? "active" : null],
        ...(props.className || []),
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
