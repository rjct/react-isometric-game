import { useGameState } from "@src/hooks/useGameState";

export function UnitPreview() {
  const { gameState } = useGameState();

  return gameState.selectedUnit ? (
    <div className={"unit-preview"}>
      <div
        className={gameState.selectedUnit.className}
        data-direction={gameState.selectedUnit.direction}
        data-action={gameState.selectedUnit.action}
      >
        <div className={"char"}></div>{" "}
      </div>
    </div>
  ) : null;
}
