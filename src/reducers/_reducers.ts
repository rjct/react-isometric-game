import { GameMap } from "@src/engine/gameMap";
import { animateFiredAmmo, AnimateFiredAmmoAction } from "@src/reducers/animateFiredAmmo";
import { cleanupFiredAmmo, CleanupFiredAmmoAction } from "@src/reducers/cleanupFiredAmmo";
import { deleteInventoryEntity, DeleteInventoryEntityReducerAction } from "@src/reducers/deleteInventoryEntity";
import { detectFiredAmmoHitsTarget, DetectFiredAmmoHitsTargetAction } from "@src/reducers/detectFiredAmmoHitsTarget";
import { updateMapUrl, UpdateMapUrlReducerAction } from "@src/reducers/detectHeroOnExitPoints";
import { addBuilding, AddBuildingReducerAction } from "@src/reducers/editor/building/addBuilding";
import {
  clearSelectedBuilding,
  ClearSelectedBuildingReducerAction,
} from "@src/reducers/editor/building/clearSelectedBuilding";
import {
  deleteSelectedBuilding,
  DeleteSelectedBuildingReducerAction,
} from "@src/reducers/editor/building/deleteSelectedBuilding";
import {
  setBuildingDirection,
  SetBuildingDirectionReducerAction,
} from "@src/reducers/editor/building/setBuildingDirection";
import {
  setBuildingOccupiesCell,
  SetBuildingOccupiesCellReducerAction,
} from "@src/reducers/editor/building/setBuildingOccupiesCell";
import {
  setBuildingPosition,
  SetBuildingPositionReducerAction,
} from "@src/reducers/editor/building/setBuildingPosition";
import { setBuildingVariant, SetBuildingVariantReducerAction } from "@src/reducers/editor/building/setBuildingVariant";
import {
  setSelectedBuilding,
  SetSelectedBuildingReducerAction,
} from "@src/reducers/editor/building/setSelectedBuilding";
import {
  clearEntityPlaceholder,
  ClearEntityPlaceholderReducerAction,
} from "@src/reducers/editor/clearEntityPlaceholder";
import {
  highlightEntityPlaceholder,
  HighlightEntityPlaceholderReducerAction,
} from "@src/reducers/editor/highlightEntityPlaceholder";
import { addLight, AddLightReducerAction } from "@src/reducers/editor/light/addLight";
import { clearSelectedLight, ClearSelectedLightReducerAction } from "@src/reducers/editor/light/clearSelectedLight";
import { deleteSelectedLight, DeleteSelectedLightReducerAction } from "@src/reducers/editor/light/deleteSelectedLight";
import {
  setGlobalLightsOpacity,
  SetGlobalLightsOpacityReducerAction,
} from "@src/reducers/editor/light/setGlobalLightsOpacity";
import {
  setGlobalShadowsColor,
  SetGlobalShadowsColorReducerAction,
} from "@src/reducers/editor/light/setGlobalShadowsColor";
import {
  setGlobalShadowsOpacity,
  SetGlobalShadowsOpacityReducerAction,
} from "@src/reducers/editor/light/setGlobalShadowsOpacity";
import { setLightColor, SetLightColorReducerAction } from "@src/reducers/editor/light/setLightColor";
import { setLightPosition, SetLightPositionReducerAction } from "@src/reducers/editor/light/setLightPosition";
import { setLightRadius, SetLightRadiusReducerAction } from "@src/reducers/editor/light/setLightRadius";
import { setSelectedLight, SetSelectedLightReducerAction } from "@src/reducers/editor/light/setSelectedLight";
import { addUnit, AddUnitReducerAction } from "@src/reducers/editor/unit/addUnit";
import { clearSelectedUnit, ClearSelectedUnitReducerAction } from "@src/reducers/editor/unit/clearSelectedUnit";
import { deleteSelectedUnit, DeleteSelectedUnitReducerAction } from "@src/reducers/editor/unit/deleteSelectedUnit";
import { setSelectedUnit, SetSelectedUnitReducerAction } from "@src/reducers/editor/unit/setSelectedUnit";
import { setUnitDead, SetUnitDeadReducerAction } from "@src/reducers/editor/unit/setUnitDead";
import { setUnitDirection, SetUnitDirectionReducerAction } from "@src/reducers/editor/unit/setUnitDirection";
import { setUnitPosition, SetUnitPositionReducerAction } from "@src/reducers/editor/unit/setUnitPosition";
import { toggleDebug, ToggleDebugReducerAction } from "@src/reducers/game/debug/toggleDebug";
import { toggleDebugFeature, ToggleDebugFeatureReducerAction } from "@src/reducers/game/debug/toggleDebugFeature";
import { toggleFeature, ToggleFeatureReducerAction } from "@src/reducers/game/debug/toggleFeature";
import { endCombat, EndCombatReducerAction } from "@src/reducers/game/endCombat";
import { endTurn, EndTurnReducerAction } from "@src/reducers/game/endTurn";
import { startCombat, StartCombatReducerAction } from "@src/reducers/game/startCombat";
import { animateUnitMove, AnimateUnitMoveReducerAction } from "@src/reducers/game/unit/animateUnitMove";
import { moveUnit, MoveUnitReducerAction } from "@src/reducers/game/unit/moveUnit";
import {
  recalculateUnitDistanceToScreenCenter,
  RecalculateUnitDistanceToScreenCenterReducerAction,
} from "@src/reducers/game/unit/recalcUnitDistanceToScreenCenter";
import {
  recalculateUnitFieldOfView,
  RecalculateUnitFieldOfViewReducerAction,
} from "@src/reducers/game/unit/recalcUnitFieldOfView";
import { setCurrentUnitAction, SetCurrentUnitActionReducerAction } from "@src/reducers/game/unit/setCurrentUnitAction";
import { setUnitMovementMode, SetUnitMovementModeReducerAction } from "@src/reducers/game/unit/setUnitMovementMode";
import { stopUnits, StopUnitsActionReducerAction } from "@src/reducers/game/unit/stopUnits";
import { useEntityInUnitHand, UseEntityInUnitHandReducerAction } from "@src/reducers/game/unit/useEntityInUnitHand";
import {
  recalculateLightsAndShadows,
  RecalculateLightsAndShadowsReducerAction,
} from "@src/reducers/light/recalculateLightsAndShadows";
import { loadMap, LoadMapReducerAction } from "@src/reducers/loadMap";
import {
  setSelectedEntityForInventoryTransfer,
  SetSelectedEntityForInventoryTransferReducerAction,
} from "@src/reducers/setSelectedEntityForInventoryTransfer";
import { SwitchGameMapReducerAction, switchMap } from "@src/reducers/switchMap";
import { transferInventoryEntity, TransferInventoryEntityReducerAction } from "@src/reducers/transferInventoryEntity";

export type GameReducerAction =
  | ToggleDebugReducerAction
  | ToggleFeatureReducerAction
  | ToggleDebugFeatureReducerAction
  //
  | LoadMapReducerAction
  | SwitchGameMapReducerAction
  | MoveUnitReducerAction
  | AnimateUnitMoveReducerAction
  | UseEntityInUnitHandReducerAction
  | RecalculateUnitFieldOfViewReducerAction
  | RecalculateUnitDistanceToScreenCenterReducerAction
  //
  | RecalculateLightsAndShadowsReducerAction
  //
  | AnimateFiredAmmoAction
  | CleanupFiredAmmoAction
  | SetCurrentUnitActionReducerAction
  | SetUnitMovementModeReducerAction
  | UpdateMapUrlReducerAction
  | TransferInventoryEntityReducerAction
  | SetSelectedEntityForInventoryTransferReducerAction
  | DeleteInventoryEntityReducerAction
  | StartCombatReducerAction
  | EndCombatReducerAction
  | EndTurnReducerAction
  //
  | DetectFiredAmmoHitsTargetAction
  //
  | HighlightEntityPlaceholderReducerAction
  | ClearEntityPlaceholderReducerAction
  //
  | AddBuildingReducerAction
  | SetSelectedBuildingReducerAction
  | ClearSelectedBuildingReducerAction
  | SetBuildingDirectionReducerAction
  | DeleteSelectedBuildingReducerAction
  | SetBuildingVariantReducerAction
  | SetBuildingPositionReducerAction
  | SetBuildingOccupiesCellReducerAction
  //
  | AddUnitReducerAction
  | SetSelectedUnitReducerAction
  | ClearSelectedUnitReducerAction
  | DeleteSelectedUnitReducerAction
  | SetUnitPositionReducerAction
  | SetUnitDeadReducerAction
  | SetUnitDirectionReducerAction
  | StopUnitsActionReducerAction
  //
  | SetGlobalShadowsOpacityReducerAction
  | SetGlobalShadowsColorReducerAction
  | SetGlobalLightsOpacityReducerAction
  | AddLightReducerAction
  | SetSelectedLightReducerAction
  | ClearSelectedLightReducerAction
  | SetLightPositionReducerAction
  | SetLightRadiusReducerAction
  | SetLightColorReducerAction
  | DeleteSelectedLightReducerAction;

export function reducer(state: GameMap, action: GameReducerAction): GameMap {
  switch (action.type) {
    case "toggleDebug":
      return toggleDebug(state, action as ToggleDebugReducerAction);

    case "toggleDebugFeature":
      return toggleDebugFeature(state, action as ToggleDebugFeatureReducerAction);

    case "toggleFeature":
      return toggleFeature(state, action as ToggleFeatureReducerAction);

    //
    case "loadMap":
      return loadMap(state, action as LoadMapReducerAction);

    case "switchMap":
      return switchMap(state, action as SwitchGameMapReducerAction);

    //

    //
    case "moveUnit":
      return moveUnit(state, action as MoveUnitReducerAction);

    case "animateUnitMove":
      return animateUnitMove(state, action as AnimateUnitMoveReducerAction);

    case "useEntityInUnitHand":
      return useEntityInUnitHand(state, action as UseEntityInUnitHandReducerAction);

    case "recalculateUnitFieldOfView":
      return recalculateUnitFieldOfView(state, action as RecalculateUnitFieldOfViewReducerAction);

    case "recalculateUnitDistanceToScreenCenter":
      return recalculateUnitDistanceToScreenCenter(state, action as RecalculateUnitDistanceToScreenCenterReducerAction);

    case "recalculateLightsAndShadows":
      return recalculateLightsAndShadows(state, action as RecalculateLightsAndShadowsReducerAction);

    case "stopUnits":
      return stopUnits(state, action as StopUnitsActionReducerAction);

    //
    case "animateFiredAmmo":
      return animateFiredAmmo(state, action as AnimateFiredAmmoAction);

    case "cleanupFiredAmmo":
      return cleanupFiredAmmo(state, action as CleanupFiredAmmoAction);

    case "setCurrentUnitAction":
      return setCurrentUnitAction(state, action as SetCurrentUnitActionReducerAction);

    case "setUnitMovementMode":
      return setUnitMovementMode(state, action as SetUnitMovementModeReducerAction);

    case "updateMapUrl":
      return updateMapUrl(state, action as UpdateMapUrlReducerAction);

    case "setSelectedEntityForInventoryTransfer":
      return setSelectedEntityForInventoryTransfer(state, action as SetSelectedEntityForInventoryTransferReducerAction);

    case "transferInventoryEntity":
      return transferInventoryEntity(state, action as TransferInventoryEntityReducerAction);

    case "deleteInventoryEntity":
      return deleteInventoryEntity(state, action as DeleteInventoryEntityReducerAction);

    case "startCombat":
      return startCombat(state, action as StartCombatReducerAction);

    case "endCombat":
      return endCombat(state, action as EndCombatReducerAction);

    case "endTurn":
      return endTurn(state, action as EndTurnReducerAction);

    // WEAPON
    case "detectFiredAmmoHitsTarget":
      return detectFiredAmmoHitsTarget(state, action as DetectFiredAmmoHitsTargetAction);

    // EDITOR
    case "highlightEntityPlaceholder":
      return highlightEntityPlaceholder(state, action as HighlightEntityPlaceholderReducerAction);

    case "clearEntityPlaceholder":
      return clearEntityPlaceholder(state, action as ClearEntityPlaceholderReducerAction);

    // EDITOR: BUILDING
    case "addBuilding":
      return addBuilding(state, action as AddBuildingReducerAction);

    case "setSelectedBuilding":
      return setSelectedBuilding(state, action as SetSelectedBuildingReducerAction);

    case "clearSelectedBuilding":
      return clearSelectedBuilding(state, action as ClearSelectedBuildingReducerAction);

    case "setBuildingDirection":
      return setBuildingDirection(state, action as SetBuildingDirectionReducerAction);

    case "deleteSelectedBuilding":
      return deleteSelectedBuilding(state, action as DeleteSelectedBuildingReducerAction);

    case "setBuildingVariant":
      return setBuildingVariant(state, action as SetBuildingVariantReducerAction);

    case "setBuildingPosition":
      return setBuildingPosition(state, action as SetBuildingPositionReducerAction);

    case "setBuildingOccupiesCell":
      return setBuildingOccupiesCell(state, action as SetBuildingOccupiesCellReducerAction);

    // EDITOR: UNIT
    case "addUnit":
      return addUnit(state, action as AddUnitReducerAction);

    case "setSelectedUnit":
      return setSelectedUnit(state, action as SetSelectedUnitReducerAction);

    case "clearSelectedUnit":
      return clearSelectedUnit(state, action as ClearSelectedUnitReducerAction);

    case "deleteSelectedUnit":
      return deleteSelectedUnit(state, action as DeleteSelectedUnitReducerAction);

    case "setUnitPosition":
      return setUnitPosition(state, action as SetUnitPositionReducerAction);

    case "setUnitDead":
      return setUnitDead(state, action as SetUnitDeadReducerAction);

    case "setUnitDirection":
      return setUnitDirection(state, action as SetUnitDirectionReducerAction);

    // EDITOR: LIGHT
    case "setGlobalShadowsOpacity":
      return setGlobalShadowsOpacity(state, action as SetGlobalShadowsOpacityReducerAction);

    case "setGlobalShadowsColor":
      return setGlobalShadowsColor(state, action as SetGlobalShadowsColorReducerAction);

    case "setGlobalLightsOpacity":
      return setGlobalLightsOpacity(state, action as SetGlobalLightsOpacityReducerAction);

    case "addLight":
      return addLight(state, action as AddLightReducerAction);

    case "setSelectedLight":
      return setSelectedLight(state, action as SetSelectedLightReducerAction);

    case "clearSelectedLight":
      return clearSelectedLight(state, action as ClearSelectedLightReducerAction);

    case "setLightPosition":
      return setLightPosition(state, action as SetLightPositionReducerAction);

    case "setLightRadius":
      return setLightRadius(state, action as SetLightRadiusReducerAction);

    case "setLightColor":
      return setLightColor(state, action as SetLightColorReducerAction);

    case "deleteSelectedLight":
      return deleteSelectedLight(state, action as DeleteSelectedLightReducerAction);
    default:
      throw new Error();
  }
}
