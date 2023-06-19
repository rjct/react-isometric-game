import React, { useEffect, useState } from "react";

export const Fade = (props: { show: boolean; children: React.ReactNode }) => {
  const [render, setRender] = useState(props.show);

  useEffect(() => {
    if (props.show) setRender(true);
  }, [props.show]);

  const onAnimationEnd = () => {
    if (!props.show) {
      setRender(false);
    }
  };

  return render ? (
    <div
      className={["unit-shadow-fade", props.show ? "fadeIn" : "fadeOut"].join(" ")}
      style={{
        animation: `${props.show ? "fadeIn" : "fadeOut"} 0.25s`,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {props.children}
    </div>
  ) : null;
};
