import { GameUI } from "../../context/GameUIContext";

export type ToggleInventoryUIReducerAction = {
  type: "toggleInventory";
};

export const toggleInventory = (state: GameUI, action: ToggleInventoryUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ scene: state.scene === "inventory" ? "game" : "inventory" },
  };
};
