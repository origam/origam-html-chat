import { observable } from "mobx";

export class Chatroom {
  @observable topic: string = "";
  @observable referenceId: string | null = null;
  @observable categoryId: string | null = null;
}
