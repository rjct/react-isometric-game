import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";

export function useMessages() {
  const { gameDispatch, uiDispatch } = useGameState();

  const notify_EntityTakesDamage = (entity: Unit | Vehicle) => {
    if (entity.damagePoints > -1) return;

    gameDispatch({
      type: "emitMessage",
      messageType: "tooltip",
      messageStyle: "red",
      messageShowStyle: "rise",
      position: entity.getRoundedPosition(),
      value: entity.damagePoints,
      timeToLiveMs: 1000,
    });
  };

  const notify_UnitEarnedXP = (unit: Unit, xp: number) => {
    gameDispatch({
      type: "emitMessage",
      messageType: "sticky",
      //messageStyle: "green",
      value: `+${xp} XP`,
      timeToLiveMs: 5000,
    });
  };

  const notify_UnitEarnedLevel = (unit: Unit) => {
    gameDispatch({
      type: "emitMessage",
      messageType: "sticky",
      messageStyle: "green",
      value: `+1 Level`,
      onClick: () => {
        uiDispatch({ type: "setScene", scene: "unitCharacteristics" });
      },
    });
  };

  return { notify_EntityTakesDamage, notify_UnitEarnedXP, notify_UnitEarnedLevel };
}
