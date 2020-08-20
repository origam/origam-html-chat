import { flow } from "mobx";
import axios from "axios";
import { IChatTransportOutgoingMessage, IChatTransport, IChatTransportTargert } from "./ChatTransport";

export class ChatTransportPolled implements IChatTransport {
  constructor(public target: IChatTransportTargert) {}

  urlBase = "http://localhost:9099/api";

  receiveMessages() {
    const self = this;
    flow(function* () {
      const response = yield axios.get(`${self.urlBase}/messages`);
      const messages = response.data.map((responseItem: any) => ({
        id: responseItem.id,
        sender: responseItem.sender,
        text: responseItem.text,
        timeSent: responseItem.timeSent,
        avatarUrl: responseItem.avatarUrl,
        type: "message",
      }));
      self.target.realtimeUpdateLog(messages);
    })();
  }

  sendMessage(message: IChatTransportOutgoingMessage): void {
    const self = this;
    flow(function* () {
      const response = yield axios.post(`${self.urlBase}/messages`, message);
    })();
  }

  start() {
    this.receiveMessages();
    setInterval(() => this.receiveMessages(), 1000);
  }
}
