import React, { useEffect, useRef, useState, useContext } from "react";
import { InviteUserModal } from "../components/InviteUserModal";
import { MessageBar } from "../components/MessageBar";
import { Sidebar } from "../components/Sidebar";
import { SidebarRow } from "../components/SidebarRow";
import { ChatFeedUI } from "./ChatFeedUI";
import { ChatParticipantsUI } from "./ChatParticipantsUI";
import { SendMessageBarUI } from "./SendMessageBarUI";
import { SampleMessages } from "../components/SampleMessages";
import { Observer } from "mobx-react";
import {
  ChatParticipantMini,
  IChatParticipantStatus,
} from "../components/ChatParticipant";
import {
  CtxChatroom,
  CtxParticipants,
  CtxInviteUserWorkflow,
  CtxAbandonChatroomWorkflow,
} from "./Contexts";
import { IParticipantStatus } from "../model/Participants";
import { getAvatarUrl } from "../helpers/avatar";

export function ChatroomScreenUI() {
  const refMessageBar = useRef<any>();

  useEffect(() => {
    if (refMessageBar.current) {
      refMessageBar.current.scrollToEnd();
    }
  }, []);

  function handleScrolledToTail(isTailed: boolean) {
    //console.log("hstt", isTailed);
    //chatroomSettings.isScrollingToLatestMessages = isTailed;
  }

  const chatroom = useContext(CtxChatroom);
  const participants = useContext(CtxParticipants);
  const inviteUserWorkflow = useContext(CtxInviteUserWorkflow);
  const abandonChatroomWorkflow = useContext(CtxAbandonChatroomWorkflow);

  function makeParticipantCountText(cnt: number) {
    return <>Participants: {cnt}</>;
  }

  function makeParticipantStatus(statusIn: IParticipantStatus) {
    switch (statusIn) {
      case IParticipantStatus.Online:
        return IChatParticipantStatus.Online;
      case IParticipantStatus.Away:
        return IChatParticipantStatus.Away;
      case IParticipantStatus.Offline:
        return IChatParticipantStatus.Offline;
      default:
        return IChatParticipantStatus.Unknown;
    }
  }

  return (
    <Observer>
      {() => {
        const participantsCountText = makeParticipantCountText(
          participants.itemCount
        );
        const participantItems = participants.items;
        const chatroomName = chatroom.topic;

        return (
          <div className="App">
            {/*<div className="sidebarArea">
              <Sidebar>
                <SidebarRow>
                  <div
                    className="addUserSidebarItem"
                    onClick={() => setIsInviteUserModalShown(true)}
                  >
                    <div className="addUserSidebarItemIcon">
                      <i className="fas fa-plus-circle" />
                    </div>
                    <div className="addUserSidebarItemContent">
                      Invite user...
                    </div>
                  </div>
                </SidebarRow>
                <ChatParticipantsUI />
              </Sidebar>
            </div>*/}
            <div className="messageArea">
              <div className="messageThreadHeader">
                <div className="messageThreadHeader__info">
                  <div className="messageThreadHeader__title">
                    <h1>{chatroomName || <>&nbsp;</>}</h1>
                  </div>
                  <div className="messageThreadHeader__body">
                    {participantsCountText}
                  </div>
                </div>
                <div className="messageThreadHeader__actions">
                  {participantItems.map((item) => (
                    <ChatParticipantMini
                      key={item.id}
                      avatar={
                        <img
                          alt=""
                          className="avatar__picture"
                          src={getAvatarUrl(item.avatarUrl)}
                        />
                      }
                      name={item.name}
                      status={makeParticipantStatus(item.status)}
                    />
                  ))}

                  <div
                    className="messageThreadHeader__actionButton"
                    onClick={() => inviteUserWorkflow.start()}
                  >
                    <i className="fas fa-user-plus" />
                  </div>
                  <div
                    className="messageThreadHeader__actionButton"
                    onClick={() => abandonChatroomWorkflow.start()}
                  >
                    <i className="fas fa-user-minus" />
                  </div>
                </div>
              </div>
              <MessageBar
                ref={refMessageBar}
                messages={/*<SampleMessages />*/ <ChatFeedUI />}
                onUserScrolledToTail={handleScrolledToTail}
                isTrackingLatestMessages={false}
              />
              <SendMessageBarUI />
            </div>

            {/*isInviteUserModalShown && (
              <InviteUserModal
                onCloseClick={() => setIsInviteUserModalShown(false)}
              />
            )*/}
          </div>
        );
      }}
    </Observer>
  );
}
