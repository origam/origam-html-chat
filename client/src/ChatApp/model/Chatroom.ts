import { observable } from "mobx";

export class Chatroom {
  @observable topic: string = "";
}