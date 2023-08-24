import React from "react";

export function FullscreenPanel(props: { overlay: boolean; classNames?: string[]; children: React.ReactNode }) {
  const classNames = [
    "fullscreen-panel",
    props.overlay ? "with-overlay" : null,
    props.classNames ? [...props.classNames] : [],
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames}>{props.children}</div>;
}
