import React from "react";
import { useGameState } from "../../hooks/useGameState";

export function EntityVariant() {
  const { gameState, gameDispatch } = useGameState();

  const [selectedVariant, setSelectedVariant] = React.useState<number>(0);
  const variants: number[] = gameState.selectedEntity ? gameState.selectedEntity.getAvailableVariants() : [];

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const variant = Number(e.target.value);

    setSelectedVariant(variant);
    gameDispatch({ type: "setEntityVariant", entityId: gameState.selectedEntity.id, variant });
  };

  React.useEffect(() => {
    setSelectedVariant(gameState.selectedEntity?.variant);
  }, [gameState.selectedEntity]);

  return (
    <>
      <input
        disabled={!gameState.selectedEntity}
        type={"range"}
        min={0}
        max={variants.length - 1}
        step={1}
        onChange={handleVariantChange}
        value={selectedVariant || 0}
      />
      {selectedVariant}
    </>
  );
}
