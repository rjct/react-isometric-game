export const LabelWithValue = (props: { title: string; value: string | number }) => {
  return (
    <div className={"label-with-value"}>
      <label>{props.title}</label>
      {props.value !== "" ? (
        <span className={"blink-white"} key={props.value}>
          {props.value}
        </span>
      ) : null}
    </div>
  );
};
