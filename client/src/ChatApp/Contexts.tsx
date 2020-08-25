import { createContext } from "react";
import { ChatLog } from "./ChatLog/ChatLog";
import { ChatParticipants } from "./ChatParticipants/ChatParticipants";
import { ChatroomSettings } from "./ChatroomSettings/ChatroomSettings";
import { IChatApi } from "./ChatApi/ChatApi";

export interface IChatAppSettings {
  userId: string;
  chatroomId: string;
}

export const CtxChatAppSettings = createContext<IChatAppSettings>({ userId: "", chatroomId: "" });

export const CtxServices = createContext<{
  chatLog: ChatLog;
  chatParticipants: ChatParticipants;
  chatroomSettings: ChatroomSettings;
  api: IChatApi;
}>(0 as any);
