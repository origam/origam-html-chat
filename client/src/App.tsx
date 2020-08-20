import React, { createContext, useEffect, useMemo, useRef } from "react";
import { ChatLog } from "./ChatLog";
import { ChatParticipants } from "./ChatParticipants";
import { ChatParticipantsUI } from "./componentIntegrations/ChatParticipants";
import { MessageBar } from "./components/MessageBar";
import { SampleMessages } from "./components/SampleMessages";
import { Sidebar } from "./components/Sidebar";
import { ChatFeedUI } from "./componentIntegrations/ChatFeed";

const chatParticipants = new ChatParticipants();
chatParticipants.setItems([
  { id: "id01", name: "Judith", avatarUrl: "https://i.pravatar.cc/35?img=25" },
  { id: "id02", name: "Ivana", avatarUrl: "https://i.pravatar.cc/35?img=27" },
]);
export const CtxChatParticipants = createContext(chatParticipants);

const chatLog = new ChatLog();
chatLog.realtimeUpdateLog([{}]);
export const CtxChatLog = createContext(chatLog);

function App() {
  const handleKeyDown = useMemo(
    () => (event: any) => {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          let text = event.target.value;
          text = text.trim();
          if (text.length > 0) {
            chatLog.appendLocalMessage(text);
          }
          event.target.value = "";
        }
      }
    },
    []
  );

  const refMessageBar = useRef<any>();

  useEffect(() => {
    if (refMessageBar.current) {
      refMessageBar.current.scrollToEnd();
    }
  }, []);

  return (
    <div className="App">
      <div className="sidebarArea">
        <Sidebar>
          <ChatParticipantsUI />
        </Sidebar>
      </div>
      <div className="messageArea">
        {/*<MessageBar messages={<SampleMessages />} ref={refMessageBar} />*/}
        {/*<Observer>{() => <ChatFeed feed={chatLog.processedMessages} />}</Observer>*/}
        <MessageBar messages={<ChatFeedUI />} />

        <div className="sendMessageBar">
          <div className="sendMessageBar__userName">Jane:</div>
          <textarea onKeyDown={handleKeyDown} className="sendMessageBar__textarea" />
        </div>
      </div>
    </div>
  );
}

export default App;

