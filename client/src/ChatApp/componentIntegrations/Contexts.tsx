import { createContext } from "react";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { Chatroom } from "../model/Chatroom";
import { LocalUser } from "../model/LocalUser";
import { Messages } from "../model/Messages";
import { Participants } from "../model/Participants";
import { InviteUserWorkflow } from "../workflows/InviteUserWorkflow";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import { AbandonChatroomWorkflow } from "../workflows/AbandonChatroomWorkflow";
import { MentionUserWorkflow } from "../workflows/MentionUserWorkflow";
import { RenameChatroomWorkflow } from "../workflows/RenameChatroomWorkflow";

export const CtxWindowsSvc = createContext<WindowsSvc>(null!);
export const CtxLocalUser = createContext<LocalUser>(null!);
export const CtxMessages = createContext<Messages>(null!);
export const CtxChatroom = createContext<Chatroom>(null!);
export const CtxParticipants = createContext<Participants>(null!);
export const CtxAPI = createContext<ChatHTTPApi>(null!);
export const CtxInviteUserWorkflow = createContext<InviteUserWorkflow>(null!);
export const CtxMentionUserWorkflow = createContext<MentionUserWorkflow>(null!);
export const CtxAbandonChatroomWorkflow = createContext<
  AbandonChatroomWorkflow
>(null!);
export const CtxRenameChatroomWorkflow = createContext<RenameChatroomWorkflow>(
  null!
);
