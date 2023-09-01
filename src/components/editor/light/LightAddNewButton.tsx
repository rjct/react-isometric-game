import { faSquarePlus } from "@fortawesome/free-solid-svg-icons/faSquarePlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { constants } from "@src/constants";
import { StaticMapLight } from "@src/context/GameStateContext";
import { randomInt } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";

export function LightAddNewButton() {
  const { gameState, gameDispatch, uiState } = useGameState();
  const handleClick = () => {
    const center = {
      x: Math.round(gameState.mapSize.width / 2),
      y: Math.round(gameState.mapSize.height / 2),
    };

    const light: StaticMapLight = {
      position: {
        x: randomInt(center.x - 5, center.x + 5),
        y: randomInt(center.y - 5, center.y + 5),
      },
      color: "#ffffff",
      radius: 6,
    };

    uiState.setScroll({
      x: light.position.x * constants.tileSize.width - (uiState.viewport.x2 - uiState.viewport.x1) / 2,
      y: light.position.y * constants.tileSize.height - (uiState.viewport.y2 - uiState.viewport.y1) / 2,
    });

    gameDispatch({ type: "addLight", entity: light });
  };

  return (
    <Button className={["ui-button-green"]} onClick={handleClick}>
      <FontAwesomeIcon icon={faSquarePlus} fixedWidth />
      <label>Add new light</label>
    </Button>
  );
}
