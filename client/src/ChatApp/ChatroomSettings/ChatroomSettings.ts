import { observable } from "mobx";

export interface IChatroomSettings {
  chatroomId: string | undefined;
  chatroomName: string | undefined;
  userId: string | undefined;
  userName: string | undefined;
  avatarUrl: string | undefined;
  isScrollingToLatestMessages: boolean;
}

export class ChatroomSettingsNull implements IChatroomSettings {
  chatroomId = "";
  chatroomName = "";
  userId = "";
  userName = "";
  avatarUrl = "";
  isScrollingToLatestMessages = true;
}

export class ChatroomSettings implements IChatroomSettings {
  @observable chatroomId: string | undefined;
  @observable chatroomName: string | undefined;
  @observable userId: string | undefined;
  @observable userName: string | undefined;
  @observable avatarUrl: string | undefined;
  @observable isScrollingToLatestMessages: boolean = false;
}
