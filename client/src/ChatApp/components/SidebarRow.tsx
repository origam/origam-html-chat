import { PropsWithChildren } from "react";
import React from "react";

export function SidebarRow(props: PropsWithChildren<{}>) {
  return <div className="sidebar__row">{props.children}</div>;
}
