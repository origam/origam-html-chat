import { PropsWithChildren } from "react";
import React from "react";

export function Button(props: PropsWithChildren<{ onClick?: any }>) {
  return (
    <button className="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
