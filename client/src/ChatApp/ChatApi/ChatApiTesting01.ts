import {
  IChatApi,
  IOutgoingMessage,
  IChatParticipant,
  IParticipantStatus,
  IChatMessage,
  IChatroomInfo,
} from "./ChatApi";

export class ChatApiTesting01 implements IChatApi {
  *getChatroomParticipants(chatroomId: string): Generator<any, IChatParticipant[]> {
    const list = [
      {
        id: "001",
        name: "Petr",
        avatarUrl: "blank",
        status: IParticipantStatus.Online,
      },
      {
        id: "002",
        name: "Maria",
        avatarUrl: "blank",
        status: IParticipantStatus.Away,
      },
      {
        id: "003",
        name: "Lane",
        avatarUrl: "blank",
        status: IParticipantStatus.Offline,
      },
      {
        id: "004",
        name: "Martin",
        avatarUrl: "blank",
        status: IParticipantStatus.Invited,
      },
    ];
    return list.filter((item) => Math.random() > 0.6);
  }

  cht = 0;
  *getChatroomInfo(chatroomId: string): Generator<any, IChatroomInfo> {
    return {
      topic: `Chatroom topic ${this.cht++}`,
    };
  }

  *notifyStatus(chatroomId: string, userId: string, status: string) {
    return;
  }

  *sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage) {
    return;
  }


  msgId = 0;
  *getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]> {
    console.log("getMessages", chatroomId, limit, afterIncludingId, beforeIncludingId);
    return [
      { id: `m001-${this.msgId++}`, userId: "001", text: `Hello there! ${this.msgId}`, timeSent: "2020-08-20T13:16:41+0000" },
      { id: `m002-${this.msgId++}`, userId: "001", text: `How are you? ${this.msgId}`, timeSent: "2020-08-20T13:19:21+0000" },
    ];
  }

  *inviteUser(chatroomId: string, userId: string, invitedUserId: string) {
    throw new Error("Method not implemented.");
  }

  *getInvitableUserList(chatroomId: string, searchPhrase?: string | undefined) {
    throw new Error("Method not implemented.");
  }

  *abandonChatroom(chatroomId: string, userId: string) {
    throw new Error("Method not implemented.");
  }
}
