import { randomUUID } from "@src/engine/helpers";

export type MessageType = "sticky" | "tooltip";
export type MessageStyle = "default" | "green" | "red";
export type MessageShowStyle = "default" | "fall" | "rise";

export interface MessageFactoryProps {
  type: MessageType;
  style?: MessageStyle;
  showStyle?: MessageShowStyle;
  value: string | number;
  position?: GridCoordinates;
  timeToLiveMs?: number;
  onClick?: () => void;
}

export class Message {
  readonly id = randomUUID();
  readonly type: MessageType;
  readonly style: MessageStyle = "default";
  readonly showStyle: MessageShowStyle = "default";
  readonly value: MessageFactoryProps["value"];
  readonly position?: GridCoordinates | null = null;
  readonly timeToLiveMs: number = Infinity;
  private readonly _onClick = () => {
    //
  };
  private _elapsedTime = 0;

  constructor(props: MessageFactoryProps) {
    this.type = props.type;
    this.value = props.value;

    if (props.style) {
      this.style = props.style;
    }

    if (props.showStyle) {
      this.showStyle = props.showStyle;
    }

    if (props.position) {
      this.position = props.position;
    }

    if (props.timeToLiveMs) {
      this.timeToLiveMs = props.timeToLiveMs;
    }

    if (props.onClick) {
      this._onClick = props.onClick.bind(this);
    }
  }

  onClick() {
    this._onClick();
  }

  update(deltaTime: number) {
    const deltaTimeInSeconds = deltaTime * 1000;

    this._elapsedTime += deltaTimeInSeconds;
  }

  isLifecycleFinished() {
    return this._elapsedTime >= this.timeToLiveMs;
  }
}
