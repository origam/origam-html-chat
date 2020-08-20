import { IRecvMessageSink, RecvMessageSinkNull, IRecvParticipantSink, RecvParticipantSinkNull } from "./ChatTransport";
import { action, flow } from "mobx";
import { wrapNullObject } from "../../util/objects";

export interface ICurrentChatFeedState {
  getLastMessageId(): string | undefined;
}

export class CurrentChatFeedStateNull implements ICurrentChatFeedState {
  static New() {
    return wrapNullObject(new CurrentChatFeedStateNull());
  }

  getLastMessageId() {
    return undefined;
  }
}

export interface ILocalChatroomSettings {
  getLocalChatroomId(): string | undefined;
  getLocalUserId(): string | undefined;
}

export class LocalChatroomSettingsNull implements ILocalChatroomSettings {
  static New() {
    return wrapNullObject(new LocalChatroomSettingsNull());
  }

  getLocalChatroomId(): string | undefined {
    return undefined;
  }

  getLocalUserId(): string | undefined {
    return undefined;
  }
}

export interface IChatMessage {
  id: string;
  userId: string;
  text: string;
  timeSent: string;
}

export enum IParticipantStatus {
  Online,
  Away,
  Offline,
  Invited,
}

export interface IChatParticipant {
  id: string;
  avatarUrl: string;
  status: IParticipantStatus;
  name: string;
}

export interface IOutgoingMessage {
  id: string;
  text: string;
}

export interface IChatApi {
  getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]>;

  getChatroomParticipants(chatroomId: string): Generator<any, IChatParticipant[]>;

  sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage): Generator;
}

export class ChatApiNull implements IChatApi {
  static New() {
    return wrapNullObject(new ChatApiNull());
  }

  *getMessages(
    chatroomId: string,
    limit: number,
    afterIncludingId?: string,
    beforeIncludingId?: string
  ): Generator<any, IChatMessage[]> {
    return [];
  }

  *getChatroomParticipants(chatroomId: string): Generator<any, IChatParticipant[]> {
    return [];
  }

  *sendMessage(chatroomId: string, userId: string, message: IOutgoingMessage): Generator {}
}

export class ChatTransportPolled {
  constructor(
    public recvMessageSink: IRecvMessageSink = RecvMessageSinkNull.New(),
    public recvParticipantSink: IRecvParticipantSink = RecvParticipantSinkNull.New(),
    public currentChatFeedState: ICurrentChatFeedState = CurrentChatFeedStateNull.New(),
    public localChatroomSettings: ILocalChatroomSettings = LocalChatroomSettingsNull.New(),
    public chatApi: IChatApi = ChatApiNull.New()
  ) {}

  messagePollingPeriodMs: number = 0;
  participantPollingPeriodMs: number = 0;
  isRunning: boolean = false;

  _hMessageTimer: any;
  _hParticipantTimer: any;

  setRecvMessageSink(sink: IRecvMessageSink) {
    this.recvMessageSink = sink;
  }

  setRecvParticipantSink(sink: IRecvParticipantSink) {
    this.recvParticipantSink = sink;
  }

  setCurrentChatFeedState(state: ICurrentChatFeedState) {
    this.currentChatFeedState = state;
  }

  setLocalChatroomSettings(settings: ILocalChatroomSettings) {
    this.localChatroomSettings = settings;
  }

  setChatApi(api: IChatApi) {
    this.chatApi = api;
  }

  setMessagePollingPeriod(ms: number) {
    this.messagePollingPeriodMs = ms;
    this.updateTimerRunningState();
  }

  setParticipantPollingPeriod(ms: number) {
    this.participantPollingPeriodMs = ms;
    this.updateTimerRunningState();
  }

  sendMessage() {}

  start() {
    this.isRunning = true;
    this.updateTimerRunningState();
  }

  stop() {
    this.isRunning = false;
    this.updateTimerRunningState();
  }

  updateTimerRunningState() {
    this.stopMessageTimer();
    this.stopParticipantTimer();
    if (this.isRunning) {
      this.startMessageTimer();
      this.startParticipantTimer();
    }
  }

  startMessageTimer() {
    if (this.messagePollingPeriodMs > 0) {
      this._hMessageTimer = setInterval(this.handleMessageTimerTick, this.messagePollingPeriodMs);
    }
  }

  stopMessageTimer() {
    if (this._hMessageTimer) clearInterval(this._hMessageTimer);
    this._hMessageTimer = undefined;
  }

  startParticipantTimer() {
    if (this.participantPollingPeriodMs > 0) {
      this._hParticipantTimer = setInterval(this.handleParticipantTimerTick, this.participantPollingPeriodMs);
    }
  }

  stopParticipantTimer() {
    if (this._hParticipantTimer) clearInterval(this._hParticipantTimer);
    this._hParticipantTimer = undefined;
  }

  @action.bound
  handleMessageTimerTick() {
    const _this = this;
    flow(function* () {
      const messages = yield* _this.chatApi.getMessages(
        _this.localChatroomSettings.getLocalChatroomId() ?? "",
        1000,
        _this.currentChatFeedState.getLastMessageId()
      );
      _this.recvMessageSink.realtimePushMessages(messages);
    })();
  }

  @action.bound
  handleParticipantTimerTick() {
    const _this = this;
    flow(function* () {
      const participants = yield* _this.chatApi.getChatroomParticipants(
        _this.localChatroomSettings.getLocalChatroomId() ?? ""
      );
      _this.recvParticipantSink.realtimeUpdateParticipants(participants);
    })();
  }
}
