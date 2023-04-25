import React from "react";

export function Loading(props: { loaded: number; total: number }) {
  const percent = Math.round((props.loaded / props.total) * 100);

  return (
    <div className={"loading with-overlay"}>
      <div>Loading</div>
      <div>
        <progress max={props.total} value={props.loaded} />
      </div>
      <div>{isNaN(percent) ? 0 : percent}%</div>
    </div>
  );
}
