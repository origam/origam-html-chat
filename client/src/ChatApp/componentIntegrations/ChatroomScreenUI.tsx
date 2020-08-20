import React, { useEffect, useRef, useState } from "react";
import { InviteUserModal } from "../components/InviteUserModal";
import { MessageBar } from "../components/MessageBar";
import { Sidebar } from "../components/Sidebar";
import { SidebarRow } from "../components/SidebarRow";
import { ChatFeedUI } from "./ChatFeedUI";
import { ChatParticipantsUI } from "./ChatParticipantsUI";
import { SendMessageBarUI } from "./SendMessageBarUI";
import { SampleMessages } from "../components/SampleMessages";

export function ChatroomScreenUI() {
  const refMessageBar = useRef<any>();

  useEffect(() => {
    if (refMessageBar.current) {
      refMessageBar.current.scrollToEnd();
    }
  }, []);

  const [isInviteUserModalShown, setIsInviteUserModalShown] = useState(false);

  return (
    <div className="App">
      <div className="sidebarArea">
        <Sidebar>
          <SidebarRow>
            <div className="addUserSidebarItem" onClick={() => setIsInviteUserModalShown(true)}>
              <div className="addUserSidebarItemIcon">
                <i className="fas fa-plus-circle" />
              </div>
              <div className="addUserSidebarItemContent">Invite user...</div>
            </div>
          </SidebarRow>
          <ChatParticipantsUI />
        </Sidebar>
      </div>
      <div className="messageArea">
        <div className="messageThreadHeader">
          <div className="messageThreadHeader__info">
            <div className="messageThreadHeader__title">
              <h1>MESSAGE THREAD</h1>
            </div>
            <div className="messageThreadHeader__body">2 participants</div>
          </div>
          <div className="messageThreadHeader__actions">
            <div className="messageThreadHeader__actionButton" onClick={() => setIsInviteUserModalShown(true)}>
              <i className="fas fa-user-plus" />
            </div>
          </div>
        </div>
        <MessageBar ref={refMessageBar} messages={<SampleMessages />} />
        <SendMessageBarUI />
      </div>

      {isInviteUserModalShown && <InviteUserModal onCloseClick={() => setIsInviteUserModalShown(false)} />}
    </div>
  );
}
