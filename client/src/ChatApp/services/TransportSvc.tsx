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

  pollingIntervalMs = 10000;
  isTerminated = false;

  async realoadPolledData() {
    this.messages.clear();
    await this.loadPolledData();
  }

  async initialLoadPolledData() {
    try {
      await this.loadPolledData();
    } catch (e) {
      console.error(e);
      const errDlg = this.windowSvc.push(renderErrorDialog(e));
      await errDlg.interact();
      errDlg.close();
    }
  }

  async loadPolledDataRecentMessagesOnly() {
    const lastMessage = this.messages.lastServerMessage;
    await this.loadPolledData(lastMessage && lastMessage.id);
  }

  async runLoop() {
    let isDelay = true;
    while (!this.isTerminated) {
      if (isDelay) await delay(this.pollingIntervalMs);
      if (this.isTerminated) return;
      isDelay = true;
      try {
        await this.loadPolledDataRecentMessagesOnly();
      } catch (e) {
        console.error(e);
        isDelay = false;
        const errDlg = this.windowSvc.push(renderErrorDialog(e));
        await errDlg.interact();
        errDlg.close();
      }
    }
  }

  terminateLoop() {
    this.isTerminated = true;
  }

  async loadPolledData(afterIdIncluding?: string) {
    const polledData = await this.api.getPolledData(afterIdIncluding);

    this.localUser.name = polledData.localUser.name;
    this.localUser.id = polledData.localUser.id;
    this.localUser.avatarUrl = polledData.localUser.avatarUrl;

    this.chatroom.topic = polledData.info.topic;
    document.title = polledData.info.topic
      ? `Chat: ${polledData.info.topic}`
      : "Chat (no topic)";

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
