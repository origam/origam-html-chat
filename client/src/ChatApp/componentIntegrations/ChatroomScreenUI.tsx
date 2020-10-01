import { autorun } from "mobx";
import { Observer } from "mobx-react";
import React, { useContext, useEffect, useRef } from "react";
import { usePrev } from "../../util/hooks";
import {
  ChatParticipantMini,
  IChatParticipantStatus,
} from "../components/ChatParticipant";
import { MessageBar } from "../components/MessageBar";
import { getAvatarUrl } from "../helpers/avatar";
import { IParticipantStatus } from "../model/Participants";
import { ChatFeedUI } from "./ChatFeedUI";
import {
  CtxAbandonChatroomWorkflow,
  CtxChatroom,
  CtxInviteUserWorkflow,
  CtxMessages,
  CtxParticipants,
  CtxRenameChatroomWorkflow,
} from "./Contexts";
import { SendMessageBarUI } from "./SendMessageBarUI";

export function ChatroomName(props: { value: string }) {
  const renameChatroomWorkflow = useContext(CtxRenameChatroomWorkflow);
  return (
    <div className="messageThreadHeader__title">
      <h1 onClick={() => renameChatroomWorkflow.start()}>
        {props.value || <>&nbsp;</>}
        <div className="messageThreadHeader__editIcon">
          <i className="fas fa-edit fa-xs" />
        </div>
      </h1>
    </div>
  );
}

export function ChatroomScreenUI() {
  const refMessageBar = useRef<any>();
  const messages = useContext(CtxMessages);

  useEffect(() => {
    let prevMsgCount: number | undefined;
    return autorun(() => {
      console.log(prevMsgCount, messages.items.length, messages.items);
      if (
        refMessageBar.current &&
        (prevMsgCount === 0 || prevMsgCount === undefined) &&
        messages.items.length !== 0
      ) {
        // 1s should be enough to be sure that the component has been already laid out
        // Otherwise this autorun gets called before the components observer before
        // the scrolled block has been filled in with messages.
        setTimeout(() => {
          refMessageBar.current?.scrollToEnd();
        }, 1000);
      }
      prevMsgCount = messages.items.length;
    });
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
                  <ChatroomName value={chatroomName} />
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
                messages={<ChatFeedUI />}
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
