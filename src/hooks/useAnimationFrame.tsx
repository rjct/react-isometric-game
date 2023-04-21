import React from "react";
import { constants } from "../constants";

export const useAnimationFrame = (
  callback: (num: number) => void,
  running: boolean
) => {
  const savedCallback = React.useRef(callback);
  const animationFrameId = React.useRef(0);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const step = 1 / constants.FPS;
    let last = performance.now();
    let dt = 0;
    let now;
    function tick() {
      now = performance.now();
      dt = dt + Math.min(1, (now - last) / 1000);

      while (dt > step) {
        dt = dt - step;
        savedCallback.current(step);
      }
      last = now;

      if (running) {
        animationFrameId.current = window.requestAnimationFrame(tick);
      }
    }

    if (running) {
      animationFrameId.current = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(animationFrameId.current);
    }
  }, [running]);
};
