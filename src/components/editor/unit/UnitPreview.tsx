import { useGameState } from "../../../hooks/useGameState";

export function UnitPreview() {
  const { gameState } = useGameState();

  return gameState.selectedUnit ? (
    <div className={"unit-preview"}>
      <div className={gameState.selectedUnit.className} data-action={"none"}>
        <div className={"char"}></div>{" "}
      </div>
    </div>
  ) : null;
}
