import React from "react";

declare global {
  interface Window {
    __APP_VERSION__: number;
    __APP_BUILD_DATE__: number;
  }
}

export const AppVersion = React.memo(() => {
  return (
    <div className={"app-build-details"}>
      <div className={"app-version"}>v{window.__APP_VERSION__}</div>
      <div className={"app-build-date"}>{new Date(window.__APP_BUILD_DATE__).toUTCString()}</div>
    </div>
  );
});
