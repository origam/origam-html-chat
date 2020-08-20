import React from "react";
import cx from "classnames";

export function Message(props: { content: React.ReactNode; isInsertedByClient?: boolean }) {
  return (
    <div className={cx("message", { "message--isInsertedByClient": props.isInsertedByClient })}>{props.content}</div>
  );
}
