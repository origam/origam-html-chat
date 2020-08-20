import { wrapNullObject } from "../../util/objects";

export interface IRecvMessage {
  id: string;
  userId: string;
  text: string;
  timeSent: string;
}

export interface IRecvMessageSink {
  realtimePushMessages(messages: IRecvMessage[]): void;
}

export class RecvMessageSinkNull implements IRecvMessageSink {
  static New() {
    return wrapNullObject(new RecvMessageSinkNull());
  }

  realtimePushMessages(messages: IRecvMessage[]): void {}
}

export interface IRecvParticipant {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface IRecvParticipantSink {
  realtimeUpdateParticipants(participants: IRecvParticipant[]): void;
}

export class RecvParticipantSinkNull implements IRecvParticipantSink {
  static New() {
    return wrapNullObject(new RecvParticipantSinkNull());
  }
  
  realtimeUpdateParticipants(participants: IRecvParticipant[]): void {}
}

export interface IChatTransport {}
