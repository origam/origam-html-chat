import { PropsWithChildren } from "react";
import React from "react";

export function TagInput(props: PropsWithChildren<{}>) {
  return <div className="tagInput">{props.children}</div>;
}

export function TagInputItem(
  props: PropsWithChildren<{ body: React.ReactNode; pin?: React.ReactNode }>
) {
  return (
    <div className="tagInput__item">
      <div className="tagInput__itemBody">{props.body}</div>
      {props.pin && <div className="tagInput__itemPin">{props.pin}</div>}
    </div>
  );
}

export function TagInputItemClose(props: PropsWithChildren<{ onClick?: any }>) {
  return (
    <div className="tagInput__close" onClick={props.onClick}>
      <i className="fas fa-times" />
    </div>
  );
}
