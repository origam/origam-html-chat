import React, { useState } from "react";
import { CtxChatAppSettings } from "../Contexts";

export function ChatApp() {
  const [settings] = useState({
    chatroomId: "",
    userId: "",
  });

  return (
    <CtxChatAppSettings.Provider value={settings}>
      <div>Chat App</div>
    </CtxChatAppSettings.Provider>
  );
}
