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
  CtxAbandonChatroomWorkflow,
  CtxMentionUserWorkflow,
  CtxRenameChatroomWorkflow,
} from "./Contexts";
import { useLocation, useHistory } from "react-router";
import { AbandonChatroomWorkflow } from "../workflows/AbandonChatroomWorkflow";
import { MentionUserWorkflow } from "../workflows/MentionUserWorkflow";
import { config } from "../config";
import { CreateChatroomWorkflow } from "../workflows/CreateChatroomWorkflow";
import { RenameChatroomWorkflow } from "../workflows/RenameChatroomWorkflow";

function ctxProvide<T>(node: React.ReactNode, Ctx: React.Context<T>, value: T) {
  return <Ctx.Provider value={value}>{node}</Ctx.Provider>;
}

export function ChatApp() {
  const location = useLocation();
  const history = useHistory();
  const locationQuery = qs.parse(location.search.slice(1));
  const references = Object.fromEntries(
    Object.entries(locationQuery).filter(([k, v]) => k.startsWith("reference"))
  );

  const chatroomId = locationQuery.chatroomId as string;
  const fakeUserId = locationQuery.fakeUserId as string;

  const [isTerminated, setIsTerminated] = useState(false);

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

    const inviteUserWorkflow = new InviteUserWorkflow(windowsSvc, api);
    const mentionUserWorkflow = new MentionUserWorkflow(windowsSvc, api);
    const abandonChatroomWorkflow = new AbandonChatroomWorkflow(
      windowsSvc,
      transportSvc,
      () => setIsTerminated(true),
      api,
      localUser
    );
    const createChatroomWorkflow = new CreateChatroomWorkflow(
      windowsSvc,
      api,
      history,
      location
    );

    const renameChatroomWorkflow = new RenameChatroomWorkflow(windowsSvc, api, transportSvc);

    return {
      windowsSvc,
      localUser,
      chatroom,
      participants,
      messages,
      transportSvc,
      inviteUserWorkflow,
      mentionUserWorkflow,
      abandonChatroomWorkflow,
      createChatroomWorkflow,
      renameChatroomWorkflow,
      api,
    };
  });

  useEffect(() => {
    if (chatroomId) {
      services.api.setChatroomId(chatroomId);
      services.transportSvc.initialLoadPolledData();
      services.transportSvc.runLoop();
      return () => {
        services.transportSvc.terminateLoop();
      };
    } else {
      services.createChatroomWorkflow.start(references);
    }
  }, [!!chatroomId]);

  let uiTree = (
    <>
      {!isTerminated && chatroomId && <ChatroomScreenUI />}
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
    services.inviteUserWorkflow
  );
  uiTree = ctxProvide(
    uiTree,
    CtxMentionUserWorkflow,
    services.mentionUserWorkflow
  );
  uiTree = ctxProvide(
    uiTree,
    CtxAbandonChatroomWorkflow,
    services.abandonChatroomWorkflow
  );
  uiTree = ctxProvide(
    uiTree,
    CtxRenameChatroomWorkflow,
    services.renameChatroomWorkflow
  );

  return <>{uiTree}</>;
}
