import { GameFx } from "@src/context/GameFxContext";
import { addFx, AddFxAction } from "@src/reducers/fx/addFx";
import { deleteFx, DeleteFxAction } from "@src/reducers/fx/deleteFx";

export type FxReducerAction = AddFxAction | DeleteFxAction;

export function FxReducer(state: GameFx, action: FxReducerAction): GameFx {
  switch (action.type) {
    case "addFx":
      return addFx(state, action as AddFxAction);

    case "deleteFx":
      return deleteFx(state, action as DeleteFxAction);
  }
}
