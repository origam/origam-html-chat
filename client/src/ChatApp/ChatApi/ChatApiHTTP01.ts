import {
  IChatApi,
  IChatMessage,
  IChatParticipant,
  IChatroomInfo,
  IOutgoingMessage,
  IParticipantStatus,
} from "./ChatApi";
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
    const participants = yield axios.get(`${this.urlBase}/chatrooms/${this.chatroomId}/participants`, {
      headers: this.headers,
    });
    console.log(participants.data);
    return participants.data.map((rawParticipant: any) => ({
      ...rawParticipant,
      status: (function () {
        if (rawParticipant.isOnline) return IParticipantStatus.Online;
        if (rawParticipant.isInvited) return IParticipantStatus.Invited;
      })(),
    })) as IChatParticipant[];
  }

  *getChatroomInfo(chatroomId: string): Generator<any, IChatroomInfo> {
    const info = yield axios.get(`${this.urlBase}/chatrooms/${this.chatroomId}/info`, { headers: this.headers });
    return { topic: (info as any).data.name };
  }

  /*
  Let the backend know that user is active in the channel.
  status: online | offline | away
*/
  *notifyStatus(chatroomId: string, userId: string, status: string) {}

  /*
  Send a message to the given chatroom
*/
  *sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage) {
    yield axios.post(
      `${this.urlBase}/chatrooms/${this.chatroomId}/messages`,
      {
        text: message.text,
        id: message.id,
      },
      { headers: this.headers }
    );
  }

  /*
  Get messages of the chatroom, limiting their count to limit and possibly 
  filtering to those before/after specific id.
*/
  *getMessages(
    chatroomId: string,
    limit: number,
    afterIdIncluding?: string,
    beforeIdIncluding?: string
  ): Generator<any, IChatMessage[]> {
    const messages = yield axios.get(`${this.urlBase}/chatrooms/${this.chatroomId}/messages`, {
      params: {
        limit,
        afterIdIncluding,
        beforeIdIncluding,
      },
      headers: this.headers,
    });
    return (messages as any).data.map((msg: any) => ({
      ...msg,
      userId: msg.authorId
    })) as IChatMessage[];
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
