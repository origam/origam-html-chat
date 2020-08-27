import React, { useEffect, useState } from "react";
import qs from "querystring";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { Chatroom } from "../model/Chatroom";
import { LocalUser } from "../model/LocalUser";
import { Messages } from "../model/Messages";
import { Participants } from "../model/Participants";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import { TransportSvc } from "../services/TransportSvc";
import { InviteUserWorkflow } from "../workflows/InviteUserWorkflow";
import { ChatroomScreenUI } from "./ChatroomScreenUI";
import {
  CtxAPI,
  CtxChatroom,
  CtxInviteUserWorkflow,
  CtxLocalUser,
  CtxMessages,
  CtxParticipants,
  CtxWindowsSvc,
} from "./Contexts";
import { useLocation } from "react-router";

function ctxProvide<T>(node: React.ReactNode, Ctx: React.Context<T>, value: T) {
  return <Ctx.Provider value={value}>{node}</Ctx.Provider>;
}

export function ChatApp() {
  const location = useLocation();
  const locationQuery = qs.parse(location.search.slice(1));

  const chatroomId = locationQuery.chatroomId as string;
  const fakeUserId = locationQuery.fakeUserId as string;

  const [services] = useState(() => {
    const windowsSvc = new WindowsSvc();
    const api = new ChatHTTPApi(chatroomId, fakeUserId);

    const localUser = new LocalUser();
    const chatroom = new Chatroom();
    const messages = new Messages();
    const participants = new Participants();

    const transportSvc = new TransportSvc(
      windowsSvc,
      messages,
      chatroom,
      participants,
      localUser,
      api
    );

    const inviteuserWorkflow = new InviteUserWorkflow(windowsSvc, api);

    return {
      windowsSvc,
      localUser,
      chatroom,
      participants,
      messages,
      transportSvc,
      inviteuserWorkflow,
      api,
    };
  });

  useEffect(() => {
    services.transportSvc.initialLoadPolledData();
    services.transportSvc.runLoop();
  }, []);

  let uiTree = (
    <>
      <ChatroomScreenUI />
      {services.windowsSvc.renderStack()}
    </>
  );
  uiTree = ctxProvide(uiTree, CtxWindowsSvc, services.windowsSvc);
  uiTree = ctxProvide(uiTree, CtxMessages, services.messages);
  uiTree = ctxProvide(uiTree, CtxLocalUser, services.localUser);
  uiTree = ctxProvide(uiTree, CtxParticipants, services.participants);
  uiTree = ctxProvide(uiTree, CtxChatroom, services.chatroom);
  uiTree = ctxProvide(uiTree, CtxAPI, services.api);
  uiTree = ctxProvide(
    uiTree,
    CtxInviteUserWorkflow,
    services.inviteuserWorkflow
  );

  return <>{uiTree}</>;
}
