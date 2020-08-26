import { observable, decorate } from "mobx";

export class Mention {
  constructor(
    public id: string = "",
    public name: string = "",
    public avatarUrl: string = ""
  ) {}
}

export class Message {
  constructor(
    public id: string = "",
    public authorId: string = "",
    public authorName: string = "",
    public authorAvatarUrl: string = "",
    public timeSent: string = "",
    public text: string = "",
    public mentions: Mention[] = [],
    public isLocalOnly: boolean = false
  ) {}
}

decorate(Message, {
  isLocalOnly: observable
})

export class Messages {
  @observable items: Message[] = [];
}
