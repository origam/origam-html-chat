import React from "react";
import cx from "classnames";
import { IChatParticipantStatus } from "../ChatParticipants/ChatParticipants";



export function ChatParticipant(props: {
  avatar: React.ReactNode;
  content: React.ReactNode;
  status?: IChatParticipantStatus;
}) {
  return (
    <div className="chatParticipant">
      <div className="chatParticipant__avatar">
        <div className="avatar">
          <div className="avatar__content">{props.avatar}</div>
          <div
            className={cx("avatar__status", {
              "avatar__status--isOffline": props.status === IChatParticipantStatus.Offline,
              "avatar__status--isOnline": props.status === IChatParticipantStatus.Online,
              "avatar__status--isAway": props.status === IChatParticipantStatus.Away,
            })}
          />
        </div>
      </div>
      <div className="chatParticipant__content">{props.content}</div>
    </div>
  );
}
