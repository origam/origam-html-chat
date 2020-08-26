import { delay } from "../../util/delay";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import React from "react";
import axios from "axios";
import { Messages } from "../model/Messages";
import { ChatHTTPApi } from "./ChatHTTPApi";
import { Chatroom } from "../model/Chatroom";
import { Participants, IParticipantStatus } from "../model/Participants";
import { LocalUser } from "../model/LocalUser";

export class TransportSvc {
  constructor(
    public windowSvc: WindowsSvc,
    public messages: Messages,
    public chatroom: Chatroom,
    public participants: Participants,
    public localUser: LocalUser,
    public api: ChatHTTPApi
  ) {}

  pollingIntervalMs = 1000;

  async realoadPolledData() {
    this.messages.clear();
    await this.loadPolledData();
  }

  async initialLoadPolledData() {
    await this.loadPolledData();
  }

  async runLoop() {
    while (true) {
      await delay(this.pollingIntervalMs);
      try {
        await this.loadPolledData();
      } catch (e) {
        const errDlg = this.windowSvc.push(renderErrorDialog(e));
        await errDlg.interact();
        errDlg.close();
      }
    }
  }

  async loadPolledData() {
    //await axios.get("unknown-url");
    const polledData = await this.api.getPolledData();

    this.localUser.name = polledData.localUser.name;
    this.localUser.id = polledData.localUser.id;
    this.localUser.avatarUrl = polledData.localUser.avatarUrl;

    this.chatroom.topic = polledData.info.topic;

    this.messages.mergeMessages({ messages: polledData.messages });

    this.participants.setItems({
      participants: polledData.participants.map((participant) => ({
        ...participant,
        status: transformStatusIn(participant.status),
      })),
    });
  }
}

function transformStatusIn(status: "online" | "away" | "offline" | "none") {
  switch (status) {
    case "away":
      return IParticipantStatus.Away;
    case "online":
      return IParticipantStatus.Online;
    case "offline":
      return IParticipantStatus.Offline;
    case "none":
      return IParticipantStatus.Unknown;
  }
}
