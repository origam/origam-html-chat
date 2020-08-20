import { createContext } from "react";

export interface IChatAppSettings {
  userId: string;
  chatroomId: string;
}

export const CtxChatAppSettings = createContext<IChatAppSettings>({ userId: "", chatroomId: "" });
