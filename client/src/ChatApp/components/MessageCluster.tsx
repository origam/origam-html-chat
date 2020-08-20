import React from "react";
import cx from "classnames";

export enum MessageClusterDirection {
  Inbound = "I",
  Outbound = "O",
}

export function MessageCluster(props: {
  avatar: React.ReactNode;
  header: React.ReactNode;
  body: React.ReactNode;
  direction: MessageClusterDirection;
}) {
  return (
    <div
      className={cx("messageCluster", {
        "messageCluster--inbound": props.direction === MessageClusterDirection.Inbound,
        "messageCluster--outbound": props.direction === MessageClusterDirection.Outbound,
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
