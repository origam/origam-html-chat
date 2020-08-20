export enum IParticipantStatus {
  Online,
  Away,
  Offline,
  Invited,
}

export interface IChatParticipant {
  id: string;
  avatarUrl: string;
  status: IParticipantStatus;
  name: string;
}

export interface IOutgoingMessage {
  id: string;
  text: string;
}

export interface IChatMessage {
  id: string;
  userId: string;
  text: string;
  timeSent: string;
}

export interface IChatApi {
  /*
    Get a list of users associated with the chatroom.
  */
  getChatroomParticipants(chatroomId: string): Generator<any, IChatParticipant[]>;

  /*
  Let the backend know that user is active in the channel.
  status: online | offline | away
*/
  notifyStatus(chatroomId: string, userId: string, status: string): Generator;

  /*
  Send a message to the given chatroom
*/
  sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage): Generator;

  /*
  Get messages of the chatroom, limiting their count to limit and possibly 
  filtering to those before/after specific id.
*/
  getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]>;

  /*
  Create user invitation for the given chatroom
*/
  inviteUser(chatroomId: string, userId: string, invitedUserId: string): Generator;

  /*
  Get list of users who can be invited to the given chatroom
*/
  getInvitableUserList(chatroomId: string, searchPhrase?: string): Generator;

  /*
  Abandon given chatroom. Users presence and invitation are cleared and the user 
  cannot reenter unless invited again
*/
  abandonChatroom(chatroomId: string, userId: string): Generator;
}
