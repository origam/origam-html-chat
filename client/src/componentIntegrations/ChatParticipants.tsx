import React, { useContext } from "react";
import { SidebarRow } from "../components/SidebarRow";
import {
  ChatParticipant, IChatParticipantStatus,
} from "../components/ChatParticipant";
import { CtxChatParticipants } from "../App";
import { Observer } from "mobx-react";
import { IChatParticipantStatus as IChatParticipantStatusModel } from "../ChatParticipants";

function itemStatus2participant(status: IChatParticipantStatusModel | undefined) {
  switch (status) {
    case IChatParticipantStatusModel.Online:
      return IChatParticipantStatus.Online;
    case IChatParticipantStatusModel.Away:
      return IChatParticipantStatus.Away;
    case IChatParticipantStatusModel.Offline:
      return IChatParticipantStatus.Offline;
  }
}

export function ChatParticipantsUI() {
  const chatParticipants = useContext(CtxChatParticipants);
  return (
    <Observer>
      {() => (
        <>
          {chatParticipants.items.map((item) => (
            <SidebarRow key={item.id}>
              <ChatParticipant
                avatar={<img alt="" className="avatar__picture" src={item.avatarUrl} />}
                content={<>{item.name}</>}
                status={itemStatus2participant(item.status)}
              />
            </SidebarRow>
          ))}
        </>
      )}
    </Observer>
  );
}
