import { observable, computed } from "mobx";

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

export class Participants {
  @observable items: Participant[] = [];

  @computed get itemCount() {
    return this.items.length;
  }
}
