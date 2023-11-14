import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@src/components/ui/Button";
import { useGameState } from "@src/hooks/useGameState";

export const EditingModeButton = () => {
  const { uiDispatch } = useGameState();

  const handleEditMapButtonClick = () => {
    uiDispatch({ type: "setScene", scene: "editor" });
  };

  return (
    <Button className={["ui-button-green"]} onClick={handleEditMapButtonClick}>
      <FontAwesomeIcon icon={faEdit} />
      <label>Edit map</label>
    </Button>
  );
};
