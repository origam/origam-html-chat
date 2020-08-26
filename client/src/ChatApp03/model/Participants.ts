import { observable, computed, action } from "mobx";

export enum IParticipantStatus {
  Online,
  Away,
  Offline,
  Unknown,
}

export class Participant {
  constructor(
    public id: string = "",
    public name: string = "",
    public avatarUrl: string = "",
    public status: IParticipantStatus = IParticipantStatus.Unknown
  ) {}
}

export interface ISetItemsArg {
  participants: {
    id: string;
    name: string;
    avatarUrl: string;
    status: IParticipantStatus;
  }[];
}

export class Participants {
  @observable items: Participant[] = [];

  @action.bound setItems(arg: ISetItemsArg) {
    this.items = arg.participants;
  }

  @computed get itemCount() {
    return this.items.length;
  }
}
