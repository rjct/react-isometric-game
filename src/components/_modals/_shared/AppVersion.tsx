import React from "react";

export const AppVersion = React.memo(() => {
  return (
    <div className={"app-build-details"}>
      <div className={"app-version"}>v{import.meta.env.__APP_VERSION__}</div>
      <div className={"app-build-date"}>{new Date(import.meta.env.__APP_BUILD_DATE__).toUTCString()}</div>
    </div>
  );
});
