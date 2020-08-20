export class ChatroomSettings {
  chatroomId: string | undefined;
  userId: string | undefined;

  getLocalChatroomId(): string | undefined {
    return this.chatroomId;
  }

  getLocalUserId(): string | undefined {
    return this.userId;
  }
}