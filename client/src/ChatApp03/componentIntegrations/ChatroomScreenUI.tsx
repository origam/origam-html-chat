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

export function ChatroomScreenUI() {
  const refMessageBar = useRef<any>();

  useEffect(() => {
    if (refMessageBar.current) {
      refMessageBar.current.scrollToEnd();
    }
  }, []);

  const [isInviteUserModalShown, setIsInviteUserModalShown] = useState(false);

  function handleScrolledToTail(isTailed: boolean) {
    //console.log("hstt", isTailed);
    //chatroomSettings.isScrollingToLatestMessages = isTailed;
  }

  return (
    <Observer>
      {() => {
        const participantsCountText = "0 participants";
        const chatroomName = "UNNAMED CHANNEL";
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
                    <h1>{chatroomName}</h1>
                  </div>
                  <div className="messageThreadHeader__body">
                    {participantsCountText}
                  </div>
                </div>
                <div className="messageThreadHeader__actions">
                  <ChatParticipantMini
                    avatar={
                      <img
                        alt=""
                        className="avatar__picture"
                        src={`https://i.pravatar.cc/35?img=25`}
                      />
                    }
                    name="SusanZ"
                    status={IChatParticipantStatus.Online}
                  />
                  <ChatParticipantMini
                    avatar={
                      <img
                        alt=""
                        className="avatar__picture"
                        src={`https://i.pravatar.cc/35?img=27`}
                      />
                    }
                    name="SusanZ"
                    status={IChatParticipantStatus.Away}
                  />
                  <ChatParticipantMini
                    avatar={
                      <img
                        alt=""
                        className="avatar__picture"
                        src={`https://i.pravatar.cc/35?img=30`}
                      />
                    }
                    name="SusanZ"
                    status={IChatParticipantStatus.Offline}
                  />
                  <div
                    className="messageThreadHeader__actionButton"
                    onClick={() => setIsInviteUserModalShown(true)}
                  >
                    <i className="fas fa-user-plus" />
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

            {isInviteUserModalShown && (
              <InviteUserModal
                onCloseClick={() => setIsInviteUserModalShown(false)}
              />
            )}
          </div>
        );
      }}
    </Observer>
  );
}
