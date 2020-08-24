import { IChatApi, IChatMessage, IChatParticipant, IChatroomInfo, IOutgoingMessage } from "./ChatApi";
import axios from "axios";

export class ChatApiHTTP01 implements IChatApi {
  urlBase = `http://localhost:9099/api`;
  userId: string = "";
  chatroomId: string = "";

  get headers() {
    return { "x-fake-user-id": this.userId };
  }

  /*
    Get a list of users associated with the chatroom.
  */
  *getChatroomParticipants(chatroomId: string) {
    const participants = yield axios.get(`${this.urlBase}/chatrooms/${this.chatroomId}/participants`);
    return participants.data as IChatParticipant[];
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
