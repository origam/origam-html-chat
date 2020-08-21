import React from "react";
import { SidebarRow } from "./SidebarRow";
import { ChatParticipant } from "./ChatParticipant";
import { IChatParticipantStatus } from "../ChatParticipants/ChatParticipants";

export function SampleParticipants() {
  return (
    <>
      <SidebarRow>
        <ChatParticipant
          avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
          content={<>Jane</>}
          status={IChatParticipantStatus.Online}
        />
      </SidebarRow>
      <SidebarRow>
        <ChatParticipant
          avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=22" />}
          content={<>Linda</>}
        />
      </SidebarRow>
      <SidebarRow>
        <ChatParticipant
          avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=23" />}
          content={<>Erica</>}
        />
      </SidebarRow>
    </>
  );
}
