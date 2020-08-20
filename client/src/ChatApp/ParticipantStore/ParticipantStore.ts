import { observable, action } from "mobx";

export enum IChatParticipantStatus {
  Online,
  Away,
  Offline,
  Unknown,
}

export interface IChatParticipant {
  id: string;
  name: string;
  status?: IChatParticipantStatus;
  avatarUrl: string;
}

export class ParticipantStore {
  @observable items: IChatParticipant[] = [];

  @action.bound setItems(items: IChatParticipant[]) {
    this.items = items;
  }

  getById(id: string) {
    return this.items.find((item) => item.id === id);
  }
}
