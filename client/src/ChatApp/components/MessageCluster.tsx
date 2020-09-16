import React from "react";
import cx from "classnames";

export enum IMessageClusterDirection {
  Inbound = "I",
  Outbound = "O",
}

export function MessageCluster(props: {
  avatar: React.ReactNode;
  header: React.ReactNode;
  body: React.ReactNode;
  direction: IMessageClusterDirection;
}) {
  return (
    <div
      className={cx("messageCluster", {
        "messageCluster--inbound": props.direction === IMessageClusterDirection.Inbound,
        "messageCluster--outbound": props.direction === IMessageClusterDirection.Outbound,
      })}
    >
      <div className="messageCluster__avatarSection">
        <div className="avatar">
          <div className="avatar__content">{props.avatar}</div>
        </div>
      </div>
      <div className="messageCluster__contentSection">
        <div className="messageCluster__header">{props.header}</div>
        <div className="messageCluster__body">{props.body}</div>
      </div>
    </div>
  );
}
