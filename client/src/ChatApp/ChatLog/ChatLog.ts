import { action, observable, computed, flow } from "mobx";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import axios from "axios";
import { wrapNullObject } from "../../util/objects";
import { IChatTransport, NullChatTransport } from "../../ChatTransport";
import { ChatroomSettings, ChatroomSettingsNull } from "../ChatroomSettings/ChatroomSettings";

/*const userName = sessionStorage.getItem("userName") || prompt("User name");
/*const avatarUrl = sessionStorage.getItem("avatarUrl") || prompt("Avatar url");*/

/*sessionStorage.setItem("userName", userName || "");
sessionStorage.setItem("avatarUrl", avatarUrl || "");*/

export enum IMessageDirection {
  Inbound,
  Outbound,
}

export interface IMessage {
  type: "message";
  id: string;
  direction: IMessageDirection;
  sender: string;
  timeSent: string;
  text: string;
  serverOrder?: number;
  isInsertedByClient: boolean;
}

export interface IMessageGroup {
  type: "message_group";
  $id: number;
  direction: IMessageDirection;
  timeSent: string;
  sender: string;
  items: IMessage[];
}

export type IChatLogItem = IMessage | IMessageGroup;

export interface IRemoteMessage {
  type: "message";
  id: string;
  sender: string;
  text: string;
  timeSent: string;
}

export type IRemoteItem = IRemoteMessage;

let genGroupId = 0;

export function makeMessageClusters(items: IChatLogItem[]): IChatLogItem[] {
  let result: IChatLogItem[] = [];
  let currentGroup: IMessageGroup | undefined;
  for (let item of items) {
    if (item.type === "message") {
      if (!currentGroup || currentGroup.direction !== item.direction || currentGroup.sender !== item.sender) {
        currentGroup = {
          type: "message_group",
          $id: genGroupId++,
          direction: item.direction,
          timeSent: item.timeSent,
          sender: item.sender,
          items: [],
        };
        result.push(currentGroup);
      }
      currentGroup.items.push(item);
    } else {
      currentGroup = undefined;
      result.push(item);
    }
  }
  return result;
}

export function processChatLogForUI(items: IChatLogItem[]): IChatLogItem[] {
  let result: IChatLogItem[] = items;
  result = makeMessageClusters(result);
  return result;
}

export class ChatLog {
  constructor(
    public transport: IChatTransport = wrapNullObject(new NullChatTransport()),
    public chatroomSettings: ChatroomSettings = wrapNullObject(new ChatroomSettingsNull())
  ) {}

  @observable rawMessages: IChatLogItem[] = [];

  @computed get processedMessages() {
    return processChatLogForUI(this.rawMessages);
  }

  @action.bound
  appendLocalMessage(text: string) {
    const message: IMessage = {
      id: uuidv4(),
      direction: IMessageDirection.Outbound,
      isInsertedByClient: true,
      sender: "id01",
      text,
      timeSent: moment().toISOString(),
      type: "message",
    };
    this.rawMessages.push(message);
    this.transport.sendMessage({
      id: message.id,
      sender: message.sender,
      text: message.text,
      timeSent: message.timeSent,
      avatarUrl: this.chatroomSettings.getLocalAvatarUrl() || "about:blank",
    });
  }

  // TODO: Argument type
  @action realtimeUpdateLog(remoteItems: IRemoteItem[]) {
    const localItemsById = new Map(remoteItems.map((item) => [item.id, item]));
    const localMessageCount = this.rawMessages.length;
    const processedRemoteItems = new Set<any>();
    for (let localItemIndex = 0; localItemIndex < localMessageCount; localItemIndex++) {
      const localItem = this.rawMessages[localItemIndex];
      switch (localItem.type) {
        case "message": {
          if (localItemsById.has(localItem.id)) {
            const remoteItem = localItemsById.get(localItem.id)!;
            localItem.isInsertedByClient = false;
            localItem.sender = remoteItem.sender;
            localItem.text = remoteItem.text;
            localItem.timeSent = remoteItem.timeSent;
            processedRemoteItems.add(remoteItem);
          }
        }
      }
    }
    for (let remoteItem of remoteItems) {
      if (processedRemoteItems.has(remoteItem)) continue;
      switch (remoteItem.type) {
        case "message": {
          const newItem: IChatLogItem = {
            type: "message",
            isInsertedByClient: false,
            sender: remoteItem.sender,
            text: remoteItem.text,
            timeSent: remoteItem.timeSent,
            direction:
              remoteItem.sender === this.chatroomSettings.getLocalUserId()
                ? IMessageDirection.Outbound
                : IMessageDirection.Inbound,
            id: remoteItem.id,
          };
          this.rawMessages.push(newItem);
        }
      }
    }
  }
}
