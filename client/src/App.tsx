import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatLog } from "./ChatApp/ChatLog/ChatLog";
import { ChatroomScreenUI } from "./ChatApp/componentIntegrations/ChatroomScreenUI";
import { CtxServices } from "./ChatApp/Contexts";
import moment from "moment";
import { ChatroomSettings } from "./ChatApp/ChatroomSettings/ChatroomSettings";
import { ChatParticipants, IChatParticipantStatus } from "./ChatApp/ChatParticipants/ChatParticipants";

function App() {
  const [stores] = useState(() => {
    const chatLog = new ChatLog();
    const chatParticipants = new ChatParticipants();
    chatParticipants.setItems([
      {
        id: "u001",
        name: "Pavel",
        avatarUrl: "https://i.pravatar.cc/35?img=12",
        status: IChatParticipantStatus.Online,
      },
      { id: "u002", name: "Linda", avatarUrl: "https://i.pravatar.cc/35?img=19", status: IChatParticipantStatus.Away },
      {
        id: "u003",
        name: "Maria",
        avatarUrl: "https://i.pravatar.cc/35?img=20",
        status: IChatParticipantStatus.Offline,
      },
      {
        id: "u004",
        name: "Ludwig",
        avatarUrl: "https://i.pravatar.cc/35?img=13",
        status: IChatParticipantStatus.Unknown,
      },
    ]);
    const chatroomSettings = new ChatroomSettings();
    chatroomSettings.userId = "u001";
    chatroomSettings.userName = "Pavel";
    chatroomSettings.avatarUrl = "https://i.pravatar.cc/35?img=12";
    chatroomSettings.chatroomId = "chr001";
    chatroomSettings.chatroomName = "Gossip, slander and blasphemy";

    chatLog.chatroomSettings = chatroomSettings;

    chatLog.realtimeUpdateLog([
      {
        id: "m001",
        sender: "u001",
        text: "This is a message",
        timeSent: moment().toISOString(),
        type: "message",
      },
      {
        id: "m002",
        sender: "u001",
        text: "This is yet another message",
        timeSent: moment().toISOString(),
        type: "message",
      },
      {
        id: "m003",
        sender: "u002",
        text: "This shall be an inbound message",
        timeSent: moment().toISOString(),
        type: "message",
      },
    ]);

    return {
      chatLog,
      chatroomSettings,
      chatParticipants,
    };
  });

  return (
    <CtxServices.Provider value={stores}>
      <ChatroomScreenUI />
    </CtxServices.Provider>
  );
}

export default App;
