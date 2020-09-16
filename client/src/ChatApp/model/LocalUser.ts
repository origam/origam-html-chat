import { observable } from "mobx";

export class LocalUser {
  @observable id: string = "";
  @observable name: string = "";
  @observable avatarUrl: string = "";
}