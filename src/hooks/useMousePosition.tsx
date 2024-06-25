import { constants } from "@src/engine/constants";
import { getAngleBetweenTwoGridPoints, screenToGridSpace } from "@src/engine/helpers";
import { normalizeRotation } from "@src/engine/weapon/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { HeroAction, HeroActionType, UserEventType, useHero } from "@src/hooks/useHero";
import React from "react";
import { useDebounce } from "use-debounce";

export interface WorldMousePosition {
  grid: GridCoordinates;
  screen: ScreenCoordinates;
  browser: ScreenCoordinates;
  isOutOfGrid: boolean;
}

const tooltipHints = {
  loot: "loot",
  getIntoVehicle: "get into vehicle",
};

type TooltipHintType = keyof typeof tooltipHints;

const getHintMessage = (messages: { eventType: UserEventType; action: HeroActionType }[]) => {
  return (
    <div className={"wireframe-tooltip-hint"}>
      {messages.map((message) => {
        return (
          <div key={message.eventType}>
            {message.eventType.toUpperCase()} to{" "}
            <span className={"wireframe-tooltip-hint-action"}>{tooltipHints[message.action as TooltipHintType]}</span>
          </div>
        );
      })}
    </div>
  );
};

export function useMousePosition() {
  const { gameState, uiState, gameDispatch } = useGameState();
  const { hero, getPossibleHeroActions } = useHero();

  const [markerPosition, setMarkerPosition] = React.useState<GridCoordinates>({ x: -1, y: -1 });
  const [markerClassName, setMarkerClassName] = React.useState(["action--allowed"]);
  const [tooltipValue, setTooltipValue] = React.useState<string | React.ReactElement | null>(null);
  const [heroAction, setHeroAction] = React.useState<HeroAction[]>([]);
  const [heroActionMenuShow, setHeroActionMenuShow] = React.useState(false);

  const debouncedMarkerPosition = useDebounce(markerPosition, 100);

  const getWorldMousePosition = (e: React.MouseEvent): WorldMousePosition => {
    const { rect, scroll } = uiState;

    const browser = {
      x: Math.round(e.clientX + scroll.x) - scroll.x,
      y: Math.round(e.clientY - rect.top) - scroll.y,
    };

    const screen = {
      x: Math.round(e.clientX - constants.tileSize.width + constants.tileSize.width / 2 + scroll.x),
      y: Math.round(e.clientY - rect.top - constants.tileSize.height + constants.tileSize.height / 2 + scroll.y),
    };
    const grid = screenToGridSpace(screen, gameState.mapSize);

    return {
      grid: {
        x: Math.round(grid.x),
        y: Math.round(grid.y),
      },
      screen: screen,
      browser: browser,
      isOutOfGrid:
        Math.round(grid.x) < 0 ||
        Math.round(grid.x) > gameState.mapSize.width - 1 ||
        Math.round(grid.y) < 0 ||
        Math.round(grid.y) > gameState.mapSize.height - 1,
    };
  };

  const updateMarker = (heroAction: Array<HeroAction>) => {
    if (heroAction.length === 0) {
      setMarkerClassName(["action--not-allowed"]);
      return;
    }

    if (heroAction.length === 1) {
      const action = heroAction[0].action;
      const isAllowed = heroAction[0].isAllowed;
      const entity = heroAction[0].entity;

      setMarkerClassName([isAllowed ? "action--allowed" : "action--not-allowed"]);

      switch (action) {
        case "loot":
          if (isAllowed) {
            setTooltipValue(getHintMessage([{ eventType: "click", action: heroAction[0].action }]));
            gameDispatch({ type: "highlightExplorableEntity", entity });
          }
          break;

        case "leftHand":
        case "rightHand":
          const probability = heroAction[0]?.probability;
          const value = probability ? `${isAllowed ? probability : 0}%` : null;

          if (value) {
            setTooltipValue(value);
          }
          break;
      }
    } else {
      setHeroActionMenuShow(true);
      setTooltipValue(
        getHintMessage([
          { eventType: "click", action: heroAction[0].action },
          { eventType: "doubleClick", action: heroAction[1].action },
        ]),
      );
      gameDispatch({ type: "highlightExplorableEntity", entity: heroAction[0].entity });
    }
  };

  React.useEffect(() => {
    setTooltipValue(null);

    if (uiState.mousePosition.isOutOfGrid) {
      setMarkerPosition({ x: -1, y: -1 });

      return;
    }

    setMarkerClassName(["action--pending"]);
    setMarkerPosition(uiState.mousePosition.grid);
  }, [uiState.mousePosition.grid.x, uiState.mousePosition.grid.y]);

  React.useEffect(() => {
    if (gameState.highlightedEntityForInventoryTransfer) {
      gameDispatch({ type: "highlightExplorableEntity", entity: null });
    }

    setHeroAction(getPossibleHeroActions(uiState.mousePosition.grid));
  }, [debouncedMarkerPosition[0], hero.currentSelectedAction, heroActionMenuShow]);

  React.useEffect(() => {
    updateMarker(heroAction);
    setHeroActionMenuShow(heroAction.length > 1);
  }, [heroAction]);

  React.useEffect(() => {
    const heroPosition = hero.getRoundedPosition();

    if (
      hero.isBusy() ||
      uiState.mousePosition.isOutOfGrid ||
      (uiState.mousePosition.grid.x === heroPosition.x && uiState.mousePosition.grid.y === heroPosition.y) ||
      gameState.mapSize.width <= 0
    )
      return;

    const angle = getAngleBetweenTwoGridPoints(uiState.mousePosition.grid, heroPosition);

    if (normalizeRotation(angle.deg, 128).deg !== normalizeRotation(hero.rotation.deg, 128).deg) {
      hero.setRotation(angle, false);
      hero.setPosition(heroPosition, gameState);
    }
  }, [uiState.mousePosition.grid]);

  return {
    getWorldMousePosition,
    markerPosition,
    markerClassName,
    tooltipValue,
    heroAction,
    heroActionMenuShow,
    setHeroActionMenuShow,
  };
}
