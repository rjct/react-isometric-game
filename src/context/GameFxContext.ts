import { Fx } from "@src/engine/fx/FxFactory";
import React from "react";

export type EffectType = "explosion" | "fire-explosion";

const gameFxContext = {
  effects: [] as Array<Fx>,
};

export const GameFxContext = React.createContext(gameFxContext);
export type GameFx = typeof gameFxContext;
