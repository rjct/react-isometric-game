import React from "react";

export const ProgressBar = React.memo((props: { value: number }) => {
  return (
    <div className={"progress-bar"}>
      <div className={"value"} style={{ width: `${props.value}%` }}></div>
    </div>
  );
});
