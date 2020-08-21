import { observable } from "mobx";

export interface IChatroomSettings {
  getLocalChatroomId(): string | undefined;
  getLocalChatroomName(): string | undefined;
  getLocalUserId(): string | undefined;
  getLocalAvatarUrl(): string | undefined;
  getLocalUserName(): string | undefined;
}

export class ChatroomSettingsNull implements IChatroomSettings {
  getLocalChatroomId(): string | undefined {
    return "";
  }

  getLocalChatroomName() {
    return "";
  }

  getLocalUserId(): string | undefined {
    return "";
  }

  getLocalAvatarUrl() {
    return "";
  }

  getLocalUserName() {
    return "";
  }
}

export class ChatroomSettings implements IChatroomSettings {
  @observable chatroomId: string | undefined;
  @observable chatroomName: string | undefined;
  @observable userId: string | undefined;
  @observable userName: string | undefined;
  @observable avatarUrl: string | undefined;

  getLocalChatroomId(): string | undefined {
    return this.chatroomId;
  }

  getLocalUserId(): string | undefined {
    return this.userId;
  }

  getLocalAvatarUrl() {
    return this.avatarUrl;
  }

  getLocalUserName() {
    return this.userName;
  }

  getLocalChatroomName() {
    return this.chatroomName;
  }
}
