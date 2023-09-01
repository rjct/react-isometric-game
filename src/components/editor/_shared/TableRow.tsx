import { ReactElement } from "react";

export function TableRow(props: { label: string; children: ReactElement | string }) {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.children}</td>
    </tr>
  );
}
