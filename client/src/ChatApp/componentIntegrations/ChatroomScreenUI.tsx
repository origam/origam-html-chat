import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatParticipantsUI } from "./ChatParticipantsUI";
import { MessageBar } from "../components/MessageBar";
import { ChatFeedUI } from "./ChatFeedUI";
import { SendMessageBarUI } from "./SendMessageBarUI";
import { SidebarRow } from "../components/SidebarRow";

import { AutoSizer, List } from "react-virtualized";
import { InviteUserModal } from "../components/InviteUserModal";

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
        <MessageBar ref={refMessageBar} messages={<ChatFeedUI />} />
        <SendMessageBarUI />
      </div>

      {isInviteUserModalShown && <InviteUserModal onCloseClick={() => setIsInviteUserModalShown(false)} />}
    </div>
  );
}
