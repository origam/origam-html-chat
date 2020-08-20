export interface IChatTransport {
  sendMessage(message: IChatTransportOutgoingMessage): void;
}

export interface IChatTransportOutgoingMessage {
  id: string;
  sender: string;
  text: string;
  timeSent: string;
  avatarUrl: string;
}

export class NullChatTransport implements IChatTransport {
  sendMessage(message: IChatTransportOutgoingMessage): void {}
}

export interface IServerMessage {
  type: "message";
  id: string;
  sender: string;
  timeSent: string;
  text: string;
  avatarUrl: string;
  serverOrder?: number;
}

export type IServerChatLogItem = IServerMessage;

export interface IChatTransportTargert {
  realtimeUpdateLog(remoteItems: IServerChatLogItem[]): void;
}