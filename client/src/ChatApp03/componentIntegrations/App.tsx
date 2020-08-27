import React, { useEffect, useState } from "react";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { Chatroom } from "../model/Chatroom";
import { LocalUser } from "../model/LocalUser";
import { Messages } from "../model/Messages";
import { IParticipantStatus, Participant, Participants } from "../model/Participants";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import { TransportSvc } from "../services/TransportSvc";
import { InviteUserWorkflow } from "../workflows/InviteUserWorkflow";
import { ChatroomScreenUI } from "./ChatroomScreenUI";
import {
  CtxAPI, CtxChatroom,

  CtxInviteUserWorkflow, CtxLocalUser, CtxMessages,


  CtxParticipants, CtxWindowsSvc
} from "./Contexts";

function ctxProvide<T>(node: React.ReactNode, Ctx: React.Context<T>, value: T) {
  return <Ctx.Provider value={value}>{node}</Ctx.Provider>;
}

export function App() {
  const chatroomId = "e5225420-888e-486d-b06e-4e49e24dc14e";

  const [services] = useState(() => {
    const windowsSvc = new WindowsSvc();
    const api = new ChatHTTPApi(chatroomId);

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

    //----------------------------------------

    chatroom.topic = "General discussion";

    localUser.avatarUrl = "003.jpg";
    localUser.id = "u01";
    localUser.name = "PTomask";

    participants.items.push(
      new Participant("p01", "Ptomask", "003.jpg", IParticipantStatus.Online),
      new Participant("p02", "ZuSusanne", "025.jpg", IParticipantStatus.Away)
    );

    /*messages.items.push(
      new Message(
        "m01",
        "u01",
        "Ptomask",
        "003.jpg",
        moment().toISOString(),
        "Hello!",
        [],
        false
      ),
      new Message(
        "m02",
        "u02",
        "Jana",
        "039.jpg",
        moment().toISOString(),
        "Hi!",
        [],
        false
      )
    );*/

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
    /*services.windowsSvc.push(() => (
      <DefaultModal footer={<ModalFooter align="center"></ModalFooter>}>
        <ModalCloseButton onClick={undefined} />
        <div style={{ width: 800, height: 400 }} />
      </DefaultModal>
    ));*/
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
