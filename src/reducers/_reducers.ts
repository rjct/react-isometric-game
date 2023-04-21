import { moveUnit, MoveUnitReducerAction } from "./moveUnit";
import { animateUnitMove, AnimateUnitMoveReducerAction } from "./animateUnitMove";
import { highlightUnitPath, HighlightUnitPathReducerAction } from "./highlightUnitPath";
import { switchMap, SwitchMapReducerAction } from "./switchMap";
import { GameMap } from "../engine/GameMap";
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
  | DetectHeroOnExitPointsAction;

export function reducer(state: typeof GameMap, action: GameReducerAction): typeof GameMap {
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

    default:
      throw new Error();
  }
}
