import { moveUnit, MoveUnitReducerAction } from "./moveUnit";
import { animateUnitMove, AnimateUnitMoveReducerAction } from "./animateUnitMove";
import { highlightUnitPath, HighlightUnitPathReducerAction } from "./highlightUnitPath";
import { switchMap, SwitchMapReducerAction } from "./switchMap";
import { animateFiredAmmo, AnimateFiredAmmoAction } from "./animateFiredAmmo";
import { cleanupFiredAmmo, CleanupFiredAmmoAction } from "./cleanupFiredAmmo";
import { setCurrentUnitAction, SetCurrentUnitActionReducerAction } from "./setCurrentUnitAction";
import {
  highlightTargetWireframeCell,
  HighlightTargetWireframeCellReducerAction,
} from "./highlightTargetWireframeCell";
import { detectFiredAmmoHitsTarget, DetectFiredAmmoHitsTargetAction } from "./detectFiredAmmoHitsTarget";
import { detectHeroOnExitPoints, DetectHeroOnExitPointsAction } from "./detectHeroOnExitPoints";
import { toggleDebug, ToggleDebugReducerAction } from "./toggleDebug";
import { transferItem, TransferItemReducerAction } from "./transferItem";
import { GameMap } from "../engine/GameMap";
import { setSelectedEntity, SetSelectedEntityReducerAction } from "./setSelectedEntity";
import { clearSelectedEntity, ClearSelectedEntityReducerAction } from "./clearSelectedEntity";
import { setEntityDirection, SetEntityDirectionReducerAction } from "./setEntityDirection";
import { setEntityVariant, SetEntityVariantReducerAction } from "./setEntityVariant";
import { deleteSelectedEntity, DeleteSelectedEntityReducerAction } from "./deleteSelectedEntity";
import { addEntity, AddEntityReducerAction } from "./addEntity";

export type GameReducerAction =
  | ToggleDebugReducerAction
  | SwitchMapReducerAction
  | MoveUnitReducerAction
  | AnimateUnitMoveReducerAction
  | AnimateFiredAmmoAction
  | CleanupFiredAmmoAction
  | HighlightUnitPathReducerAction
  | HighlightTargetWireframeCellReducerAction
  | SetCurrentUnitActionReducerAction
  | DetectFiredAmmoHitsTargetAction
  | DetectHeroOnExitPointsAction
  | TransferItemReducerAction
  | AddEntityReducerAction
  | SetSelectedEntityReducerAction
  | ClearSelectedEntityReducerAction
  | SetEntityDirectionReducerAction
  | DeleteSelectedEntityReducerAction
  | SetEntityVariantReducerAction;

export function reducer(state: GameMap, action: GameReducerAction): GameMap {
  switch (action.type) {
    case "toggleDebug":
      return toggleDebug(state, action as ToggleDebugReducerAction);

    case "switchMap":
      return switchMap(state, action as SwitchMapReducerAction);

    case "moveUnit":
      return moveUnit(state, action as MoveUnitReducerAction);

    case "animateUnitMove":
      return animateUnitMove(state, action as AnimateUnitMoveReducerAction);

    case "highlightUnitPath":
      return highlightUnitPath(state, action as HighlightUnitPathReducerAction);

    case "animateFiredAmmo":
      return animateFiredAmmo(state, action as AnimateFiredAmmoAction);

    case "cleanupFiredAmmo":
      return cleanupFiredAmmo(state, action as CleanupFiredAmmoAction);

    case "setCurrentUnitAction":
      return setCurrentUnitAction(state, action as SetCurrentUnitActionReducerAction);

    case "highlightTargetWireframeCell":
      return highlightTargetWireframeCell(state, action as HighlightTargetWireframeCellReducerAction);

    case "detectFiredAmmoHitsTarget":
      return detectFiredAmmoHitsTarget(state, action as DetectFiredAmmoHitsTargetAction);

    case "detectHeroOnExitPoints":
      return detectHeroOnExitPoints(state, action as DetectHeroOnExitPointsAction);

    case "transferItem":
      return transferItem(state, action as TransferItemReducerAction);

    case "addEntity":
      return addEntity(state, action as AddEntityReducerAction);

    case "setSelectedEntity":
      return setSelectedEntity(state, action as SetSelectedEntityReducerAction);

    case "clearSelectedEntity":
      return clearSelectedEntity(state, action as ClearSelectedEntityReducerAction);

    case "setEntityDirection":
      return setEntityDirection(state, action as SetEntityDirectionReducerAction);

    case "deleteSelectedEntity":
      return deleteSelectedEntity(state, action as DeleteSelectedEntityReducerAction);

    case "setEntityVariant":
      return setEntityVariant(state, action as SetEntityVariantReducerAction);

    default:
      throw new Error();
  }
}
