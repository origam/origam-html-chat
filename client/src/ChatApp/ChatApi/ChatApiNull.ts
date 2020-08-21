import { IOutgoingMessage, IChatParticipant, IChatApi, IChatMessage, IChatroomInfo } from "./ChatApi";

export class ChatApiNull implements IChatApi {
  /*
    Get a list of users associated with the chatroom.
  */
  *getChatroomParticipants(chatroomId: string) {
    return [] as IChatParticipant[];
  }

  *getChatroomInfo(chatroomId: string): Generator<any, IChatroomInfo> {
    return { topic: "" };
  }

  /*
    Let the backend know that user is active in the channel.
    status: online | offline | away
  */
  *notifyStatus(chatroomId: string, userId: string, status: string) {}

  /*
    Send a message to the given chatroom
  */
  *sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage) {}

  /*
    Get messages of the chatroom, limiting their count to limit and possibly 
    filtering to those before/after specific id.
  */
  *getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]> {
    return [];
  }

  /*
    Create user invitation for the given chatroom
  */
  *inviteUser(chatroomId: string, userId: string, invitedUserId: string) {}

  /*
    Get list of users who can be invited to the given chatroom
  */
  *getInvitableUserList(chatroomId: string, searchPhrase?: string) {}

  /*
    Abandon given chatroom. Users presence and invitation are cleared and the user 
    cannot reenter unless invited again
  */
  *abandonChatroom(chatroomId: string, userId: string) {}
}
