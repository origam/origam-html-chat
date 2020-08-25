import { PropsWithChildren } from "react";
import React from "react";

export function Sidebar(props: PropsWithChildren<{}>) {
  return <div className="sidebar">{props.children}</div>;
}
