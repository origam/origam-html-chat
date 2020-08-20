interface IRemoteMessage {

}

interface IStoredMessage {

}

export class MessageStore {
  items: IStoredMessage[] = []

  setRemoteMessages(messages: IRemoteMessage[]) {}

  mergeRemoteMessages(messages: IRemoteMessage[]) {}

  pushLocalMessage(message: string) {}

  getMessages() {}
}