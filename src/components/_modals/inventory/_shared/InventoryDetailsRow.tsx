import React from "react";

export function InventoryDetailsRow(props: { label: string; children: React.ReactNode }) {
  if (!props.children) return null;

  return (
    <li>
      <div className={"prop"}>{props.label}:</div>
      <div className={"value"}>{props.children}</div>
    </li>
  );
}
