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
    api.chatroomId = chatroomId as string;
    api.userId = userId as string;

    const chatLog = new ChatLog();
    const chatParticipants = new ChatParticipants();

    const chatroomSettings = new ChatroomSettings();
    chatroomSettings.userId = userId as string;
    chatroomSettings.userName = "";
    chatroomSettings.avatarUrl = "";
    chatroomSettings.chatroomId = chatroomId as string;
    chatroomSettings.chatroomName = "";
    chatroomSettings.isScrollingToLatestMessages = true;

    chatLog.chatroomSettings = chatroomSettings;



    return {
      chatLog,
      chatroomSettings,
      chatParticipants,
      api
    };
  });

  useEffect(() => {
    const {api, chatroomSettings, chatLog, chatParticipants} = stores;

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
      console.log(chatParticipants)
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
      console.log(messages)
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
  })

  return (
    <CtxServices.Provider value={stores}>
      <ChatroomScreenUI />
    </CtxServices.Provider>
  );
}

export default App;
