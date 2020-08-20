import { IChatApi, IOutgoingMessage, IChatParticipant, IParticipantStatus, IChatMessage } from "./ChatApi";

export class ChatApiTesting01 implements IChatApi {
  *getChatroomParticipants(chatroomId: string): Generator<any, IChatParticipant[]> {
    return [
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
  }

  *notifyStatus(chatroomId: string, userId: string, status: string) {
    return;
  }

  *sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage) {
    return;
  }

  *getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]> {
    return [
      { id: "m001", userId: "001", text: "Hello there!", timeSent: "2020-08-20T13:16:41+0000" },
      { id: "m002", userId: "001", text: "How are you?", timeSent: "2020-08-20T13:19:21+0000" },
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
