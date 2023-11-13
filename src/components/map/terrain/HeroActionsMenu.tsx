import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { constants } from "@src/engine/constants";
import { HeroAction, heroActionTypes } from "@src/hooks/useHero";

export function HeroActionsMenu(props: {
  show: boolean;
  coordinates: GridCoordinates;
  heroActions: HeroAction[];
  onMouseLeave: () => void;
  onClick: (heroAction: HeroAction) => void;
}) {
  if (!props.show) return null;

  const handleMouseLeave = () => {
    props.onMouseLeave();
  };

  const handleMenuItemClick = (heroAction: HeroAction) => {
    props.onClick(heroAction);
  };

  return (
    <div
      className={"hero-actions-menu"}
      style={{
        left: props.coordinates.x * constants.wireframeTileSize.width,
        top: props.coordinates.y * constants.wireframeTileSize.height,
        transform: "rotateZ(-45deg) scaleY(2)",
      }}
      onMouseLeave={handleMouseLeave}
    >
      {props.heroActions.map((heroAction, index) => {
        return (
          <li
            key={heroAction.action}
            data-action={heroAction.action}
            style={{
              transform: [`rotate(${90 - (32 / 2) * props.heroActions.length + index * 32}deg)`, `skew(60deg)`].join(
                " ",
              ),
            }}
          >
            <div onClick={() => handleMenuItemClick(heroAction)}>
              <span>
                <FontAwesomeIcon icon={heroActionTypes[heroAction.action].icon} size={"xl"} />
              </span>
            </div>
          </li>
        );
      })}
    </div>
  );
}
