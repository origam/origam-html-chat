import { ChatroomScreenUI } from "./ChatroomScreenUI";
import React, {
  useState,
  createContext,
  PropsWithChildren,
  useEffect,
} from "react";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { LocalUser } from "../model/LocalUser";
import {
  DefaultModal,
  ModalFooter,
  ModalCloseButton,
} from "../components/Windows/Windows";
import { Messages, Message } from "../model/Messages";
import {
  CtxWindowsSvc,
  CtxMessages,
  CtxLocalUser,
  CtxChatroom,
  CtxParticipants,
} from "./Contexts";
import { Chatroom } from "../model/Chatroom";
import {
  Participants,
  Participant,
  IParticipantStatus,
} from "../model/Participants";
import moment from "moment";

function ctxProvide<T>(node: React.ReactNode, Ctx: React.Context<T>, value: T) {
  return <Ctx.Provider value={value}>{node}</Ctx.Provider>;
}

export function App() {
  const [services] = useState(() => {
    const windowsSvc = new WindowsSvc();
    const localUser = new LocalUser();
    const chatroom = new Chatroom();
    const messages = new Messages();
    const participants = new Participants();

    chatroom.topic = "General discussion";

    localUser.avatarUrl = "003.jpg";
    localUser.id = "u01";
    localUser.name = "PTomask";

    participants.items.push(
      new Participant("p01", "Ptomask", "003.jpg", IParticipantStatus.Online),
      new Participant("p02", "ZuSusanne", "025.jpg", IParticipantStatus.Away)
    );

    messages.items.push(
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
    );

    return {
      windowsSvc,
      localUser,
      chatroom,
      participants,
      messages,
    };
  });

  useEffect(() => {
    /*services.windowsSvc.push(() => (
      <DefaultModal footer={<ModalFooter align="center"></ModalFooter>}>
        <ModalCloseButton onClick={undefined} />
        <div style={{ width: 800, height: 400 }} />
      </DefaultModal>
    ));*/
  });

  let uiTree = <ChatroomScreenUI />;
  uiTree = ctxProvide(uiTree, CtxWindowsSvc, services.windowsSvc);
  uiTree = ctxProvide(uiTree, CtxMessages, services.messages);
  uiTree = ctxProvide(uiTree, CtxLocalUser, services.localUser);
  uiTree = ctxProvide(uiTree, CtxParticipants, services.participants);
  uiTree = ctxProvide(uiTree, CtxChatroom, services.chatroom);

  return (
    <>
      {uiTree}
      {services.windowsSvc.renderStack()}
    </>
  );
}
