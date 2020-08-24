import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatLog } from "./ChatApp/ChatLog/ChatLog";
import { ChatroomScreenUI } from "./ChatApp/componentIntegrations/ChatroomScreenUI";
import { CtxServices } from "./ChatApp/Contexts";
import moment from "moment";
import { ChatroomSettings } from "./ChatApp/ChatroomSettings/ChatroomSettings";
import { ChatParticipants, IChatParticipantStatus } from "./ChatApp/ChatParticipants/ChatParticipants";
import { runInAction, flow } from "mobx";
import { ChatApiTesting01 } from "./ChatApp/ChatApi/ChatApiTesting01";
import { IParticipantStatus } from "./ChatApp/ChatTransport/ChatTransportPolled";
import { ChatApiHTTP01 } from "./ChatApp/ChatApi/ChatApiHTTP01";
import qs from "querystring";
import { useLocation } from "react-router";

function convertParticipantStatus(statusIn: IParticipantStatus): IChatParticipantStatus {
  switch (statusIn) {
    case IParticipantStatus.Away:
      return IChatParticipantStatus.Away;
    case IParticipantStatus.Online:
      return IChatParticipantStatus.Online;
    case IParticipantStatus.Offline:
      return IChatParticipantStatus.Offline;
    default:
      return IChatParticipantStatus.Unknown;
  }
}

function App() {
  console.log(useLocation());
  const { userId, chatroomId } = qs.parse(useLocation().search.slice(1));
  console.log(userId, chatroomId);

  const [stores] = useState(() => {
    //const api = new ChatApiTesting01();

    const api = new ChatApiHTTP01();

    const chatLog = new ChatLog();
    const chatParticipants = new ChatParticipants();
    /*chatParticipants.setItems([
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
    ]);*/
    const chatroomSettings = new ChatroomSettings();
    chatroomSettings.userId = "u001";
    chatroomSettings.userName = "Pavel";
    chatroomSettings.avatarUrl = "https://i.pravatar.cc/35?img=12";
    chatroomSettings.chatroomId = "chr001";
    chatroomSettings.chatroomName = "Gossip, slander and blasphemy";
    chatroomSettings.isScrollingToLatestMessages = true;

    chatLog.chatroomSettings = chatroomSettings;

    const reloadChatroomInfo = flow(function* () {
      const chatroomInfo = yield* api.getChatroomInfo(chatroomSettings.chatroomId!);
      chatroomSettings.chatroomName = chatroomInfo.topic;
    });

    const reloadChatroomParticipants = flow(function* () {
      const participants = yield* api.getChatroomParticipants(chatroomSettings.chatroomId!);
      chatParticipants.setItems(
        participants.map((partIn) => ({
          ...partIn,
          status: convertParticipantStatus(partIn.status),
        }))
      );
    });

    const reloadChatroomMessages = flow(function* () {
      const initialMessages = yield* api.getMessages(chatroomSettings.chatroomId!, 100);
      chatLog.clear();
      chatLog.realtimeUpdateLog(
        initialMessages.map((msgIn) => ({
          ...msgIn,
          type: "message",
          sender: msgIn.userId,
        }))
      );
    });

    const loadLatestMessages = flow(function* () {
      const lastMessage = chatLog.getLastServerMessage();
      const messages = yield* api.getMessages(chatroomSettings.chatroomId!, 100, lastMessage?.id);
      chatLog.realtimeUpdateLog(
        messages.map((msgIn) => ({
          ...msgIn,
          type: "message",
          sender: msgIn.userId,
        }))
      );
    });

    reloadChatroomMessages();
    Promise.all([reloadChatroomInfo(), reloadChatroomParticipants()]);
    setInterval(() => {
      Promise.all([reloadChatroomInfo(), reloadChatroomParticipants(), loadLatestMessages()]);
    }, 5000);

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
