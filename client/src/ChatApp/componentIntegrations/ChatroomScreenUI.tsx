import React, { useEffect, useRef, useState, useContext } from "react";
import { InviteUserModal } from "../components/InviteUserModal";
import { MessageBar } from "../components/MessageBar";
import { Sidebar } from "../components/Sidebar";
import { SidebarRow } from "../components/SidebarRow";
import { ChatFeedUI } from "./ChatFeedUI";
import { ChatParticipantsUI } from "./ChatParticipantsUI";
import { SendMessageBarUI } from "./SendMessageBarUI";
import { SampleMessages } from "../components/SampleMessages";
import { CtxServices } from "../Contexts";
import { Observer } from "mobx-react";

export function ChatroomScreenUI() {
  const refMessageBar = useRef<any>();

  const { chatParticipants, chatroomSettings } = useContext(CtxServices);

  useEffect(() => {
    if (refMessageBar.current) {
      refMessageBar.current.scrollToEnd();
    }
  }, []);

  const [isInviteUserModalShown, setIsInviteUserModalShown] = useState(false);

  function handleScrolledToTail(isTailed: boolean) {
    //console.log("hstt", isTailed);
    chatroomSettings.isScrollingToLatestMessages = isTailed;
  }

  return (
    <Observer>
      {() => {
        const participantsCountText = (function () {
          if (chatParticipants.participantsCount > 1) return <>{chatParticipants.participantsCount} participants</>;
          return <>{chatParticipants.participantsCount} participant</>;
        })();
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
                    <h1>{chatroomSettings.chatroomName}</h1>
                  </div>
                  <div className="messageThreadHeader__body">{participantsCountText}</div>
                </div>
                <div className="messageThreadHeader__actions">
                  <div className="messageThreadHeader__actionButton" onClick={() => setIsInviteUserModalShown(true)}>
                    <i className="fas fa-user-plus" />
                  </div>
                </div>
              </div>
              <MessageBar
                ref={refMessageBar}
                messages={/*<SampleMessages />*/ <ChatFeedUI />}
                onUserScrolledToTail={handleScrolledToTail}
                isTrackingLatestMessages={chatroomSettings.isScrollingToLatestMessages}
              />
              <SendMessageBarUI />
            </div>

            {isInviteUserModalShown && <InviteUserModal onCloseClick={() => setIsInviteUserModalShown(false)} />}
          </div>
        );
      }}
    </Observer>
  );
}
