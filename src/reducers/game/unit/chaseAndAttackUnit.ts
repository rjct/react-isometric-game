import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface ChaseAndAttackReducerAction {
  type: "chaseAndAttackUnit";
  unit: Unit;
  enemyUnit: Unit;
}

export function chaseAndAttackUnit(state: GameMap, action: ChaseAndAttackReducerAction): GameMap {
  action.unit.stop();
  action.unit.idle();

  // const weapon = action.unit.getFirstAvailableWeapon();
  //
  // if (!weapon) return state;
  //
  // if (action.unit.mode === "peaceful") {
  //   action.unit.stop(state);
  //   action.unit.mode = "disturbed";
  //   action.unit.coolDownTimer = 2;
  //
  //   return state;
  //   // action.unit.coolDownTimer = 1;
  //   // action.unit.stop(state);
  // }
  //
  // const distanceToEnemy = getDistanceBetweenGridPoints(action.unit.position, action.enemyUnit.position);
  //
  // if (distanceToEnemy <= weapon?.range) {
  //   action.unit.stop(state);
  //
  //   weapon.aimAt(action.enemyUnit.position);
  //   weapon.use(action.enemyUnit.position);
  //
  //   console.log(weapon.isReadyToUse(), weapon);
  //
  //   action.unit.coolDownTimer = 1;
  // } else {
  //   action.unit.chaseUnit(action.enemyUnit, state);
  //
  //   return { ...state };
  // }

  return state;
}
