import React from "react";

export function FullscreenPanel(props: {
  overlay: boolean;
  classNames?: string[];
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const classNames = [
    "fullscreen-panel",
    props.overlay ? "with-overlay" : null,
    props.classNames ? [...props.classNames] : [],
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <div className={classNames} onClick={handleClick}>
      {props.children}
    </div>
  );
}
