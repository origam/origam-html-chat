import { ChatTransportPolled } from "./ChatTransport/ChatTransportPolled";
import { ChatApiTesting01 } from "./ChatApi/ChatApiTesting01";
import { MessageStore } from "./MessageStore/MessageStore";
import { ParticipantStore } from "./ParticipantStore/ParticipantStore";
import { IRecvMessageSink } from "./ChatTransport/ChatTransport";
import { ChatroomSettings } from "./ChatroomSettings/ChatroomSettings";

function MessageStore2Sink<K extends keyof IRecvMessageSink>(messageStore: MessageStore) {
  return (new Proxy(messageStore, {
    get(target, prop: K) {
      if (prop === "realtimePushMessages") {
        return messageStore.mergeRemoteMessages.bind(messageStore);
      }
      return (target as any)[prop];
    },
  }) as unknown) as IRecvMessageSink;
}

/*function adapter<TFrom, TTo>(from: TFrom, override: { [P in keyof TFrom]: any }) {
  return (new Proxy(from as any, {
    get(target, prop) {
      if (prop in override) {
        return (override as any)[prop];
      }
      return (target as any)[prop];
    },
  }) as unknown) as TTo;
}

function MessageStore2Sink<MessageStore, IRecvMesageSink>(messageStore: MessageStore) {
  return adapter(messageStore, {get pushLocalMessage() {return messageStore.}})
}*/

export function buildApplication() {
  const localChatroomSettings = new ChatroomSettings();
  const chatTransport = new ChatTransportPolled();
  const chatApi = new ChatApiTesting01();
  const messageStore = new MessageStore();
  const participantStore = new ParticipantStore();

  chatTransport.setChatApi(chatApi);
  chatTransport.setRecvMessageSink(MessageStore2Sink(messageStore));

  
}
